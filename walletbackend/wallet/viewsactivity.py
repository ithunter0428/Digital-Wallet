from django.http import HttpResponse
from django.db.models import Avg, Count, Min, Sum
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

# register user
class RegisterUserAPIView(generics.CreateAPIView):
  permission_classes = (AllowAny,)
  serializer_class = RegisterSerializer

# get user info by username
class UserViewSet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        user = get_user(request.data['username'])
        serializer = UserSerializer(user)
        return Response(serializer.data)

# user login
class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request):
        response = super(CustomObtainAuthToken, self).post(request)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'email': token.user.email})

# user logout
class LogoutViewSet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        userToken = Token.objects.get(user=request.user.id)
        userToken.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
