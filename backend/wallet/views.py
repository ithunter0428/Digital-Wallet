from asyncio.windows_events import NULL
from django.http import HttpResponse
from django.db.models import Avg, Count, Min, Sum, F
# from django.contrib.gis.utils import GeoIP

from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer

from django.contrib.auth.models import User
from .models import Wallet
from fiat.models import UserBalance
from .serializers import UserSerializer, RegisterSerializer

import sentry_sdk
from sentry_sdk import capture_exception

sentry_sdk.init(
    "https://2af1e18494a14e72a7572e9670f731e1@o1247101.ingest.sentry.io/6406951",
    traces_sample_rate = 1.0
)

def get_user(username):
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_userID(id):
    try:
        return User.objects.get(id=id)
    except User.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_wallet(userid):
    try:
        return Wallet.objects.get(user = userid)
    except Wallet.DoesNotExist:
        return NULL

# register user
class RegisterUserAPIView(generics.CreateAPIView):
  permission_classes = (AllowAny,)
  serializer_class = RegisterSerializer

# get user info by username
class UserViewSet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            user = get_user(request.data['username'])
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# get wallet info
class WalletViewSet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            wallet = get_wallet(request.user.id)
            if wallet == NULL:
                return Response({'data': {'closed': 1}})
            return Response({
                'data': {
                    'name': wallet.wallet_name,
                    'closed': 0
                }
            })
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# change wallet name
class ChangeWalletName(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        # name

        try:
            wallet = get_wallet(request.user.id)
            if wallet == NULL:
                return Response("Wallet is closed", status = status.HTTP_400_BAD_REQUEST, headers="")
            wallet.wallet_name = request.data['name']
            wallet.save()
            return Response({'data': 'success'})
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# close wallet
class CloseWallet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        # name

        try:
            wallet = get_wallet(request.user.id)
            if wallet == NULL:
                return Response("Wallet is already closed", status = status.HTTP_400_BAD_REQUEST, headers="")

            userbalances = UserBalance.objects.all().filter(user = request.user.id)
            if userbalances.count() == 0:
                total = 0
            else:
                total = userbalances.aggregate(total = Sum(F('available_balance') + F('current_balance')))['total']
            print(total)
            if total > 1e-8:
                return Response("Wallet is not empty", status = status.HTTP_400_BAD_REQUEST, headers="")

            wallet.delete()
            return Response({'data': 'success'})
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# user login
class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request):
        response = super(CustomObtainAuthToken, self).post(request)
        token = Token.objects.get(key=response.data['token'])
        wallet = get_wallet(token.user.id)
        wallet_name, closed = 'error', 0
        if wallet == NULL:
            closed = 1
        else:
            wallet_name = wallet.wallet_name
        # user = get_userID(request.user.id)
        # super_user = request.user.is_superuser
        return Response({
            'token': token.key, 
            'email': token.user.email,
            'username': token.user.username,
            'wallet_name': wallet_name,
            'wallet_closed': closed,
            # 'super_user': super_user,
        })

# user logout
class LogoutViewSet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        userToken = Token.objects.get(user=request.user.id)
        userToken.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
