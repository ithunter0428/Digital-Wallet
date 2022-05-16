from asyncio.windows_events import NULL
from zoneinfo import available_timezones
from django.http import HttpResponse
from django.db.models import Avg, Count, Min, Sum, Q
# from django.contrib.gis.utils import GeoIP

from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer

from django.contrib.auth.models import User
from .models import UserBalance, UserBalanceHistory
from wallet.models import Wallet

from .serializers import UserBalanceSerializer, UserBalanceHistorySerializer
from sentry_sdk import capture_exception
import time
import json
import stripe

def get_balance(userid, currency):
    try:
        userbalance = UserBalance.objects.get(user=userid)
        return userbalance
    except UserBalance.DoesNotExist:
        balance = UserBalance.objects.create(user=get_user_by_id(userid), currency=currency)
        return balance


def get_user_by_id(userid):
    try:
        return User.objects.get(id=userid)
    except User.DoesNotExist:
        return NULL

def get_user_by_name(username):
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        return NULL

def get_transaction(id):
    try:
        return UserBalanceHistory.objects.get(id = id)
    except UserBalanceHistory.DoesNotExist:
        return NULL

def get_wallet(userid):
    try:
        return Wallet.objects.get(user = userid)
    except Wallet.DoesNotExist:
        return NULL

def serialize_transactions(objects):
    serializer = UserBalanceHistorySerializer(objects, many=True)
    list = serializer.data
    list = json.loads(json.dumps(list))
    for history in list:
        history['sender'] = history['sender']['username']
        history['recipient'] = history['recipient']['username']
    return list

# get current fiat balance
class GetBalance(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        try:
            balance = get_balance(request.user.id, request.data['currency'])
            serializer = UserBalanceSerializer(balance)
            response = {"data": serializer.data}
            return Response(response, status=status.HTTP_200_OK, headers="")
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# add fund to account with stripe
class TopUpFromStripe(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        # currency
        # amount
        # email
        # payment_method_id
        
        try:
            currency, amount, email, payment_method_id = request.data['currency'], request.data['amount'], request.data['email'], request.data['payment_method_id']
            fee = amount * 0.015 + 0.3

            if amount < 5:
                return Response('Amount must be over 5', status = status.HTTP_400_BAD_REQUEST, headers="")
            if amount > 500:
                return Response('Amount must be less 500', status = status.HTTP_400_BAD_REQUEST, headers="")

            customers = stripe.Customer.list(email=email).data
            if len(customers) == 0:     # if the array is empty it means the email has not been used yet
                customer = stripe.Customer.create(email=email, payment_method=payment_method_id, invoice_settings={'default_payment_method': payment_method_id})
            else:
                customer = customers[0]
            stripe.PaymentIntent.create(customer=customer, payment_method=payment_method_id, currency=currency, amount=currency, confirm=True)

            balance = get_balance(request.user.id, currency)

            # save new transaction
            new_transaction = UserBalanceHistory(
                currency = currency,
                sender = User.objects.get(id = 1),
                recipient = request.user,
                amount = amount,
                time = int(time.time()),
                fee = fee,
            )
            new_transaction.save()

            # add user's current balance
            balance.current_balance = balance.current_balance + amount - fee
            balance.save()
            
            response = {"data": {'tx_id': new_transaction.id}}
            return Response(response, status=status.HTTP_200_OK, headers="")
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# confirm top up and make fund available
class ConfirmTopUpTransaction(APIView):
    # authentication_classes = [TokenAuthentication, ]
    # permission_classes = [IsAuthenticated, ]
    def post(self, request):
        # transaction
        
        try:
            transaction = get_transaction(request.data['transaction'])

            if transaction == NULL:
                return Response('Invalid transaction', status = status.HTTP_400_BAD_REQUEST, headers="")

            # confirm transaction
            transaction.confirmed = True
            transaction.save()

            # remove current balance and add available balance
            real_amount = transaction.amount - transaction.fee
            user_balance = get_balance(transaction.recipient, transaction.currency)
            user_balance.available_balance = user_balance.available_balance + real_amount
            user_balance.current_balance = user_balance.current_balance - real_amount
            if user_balance.enabled == False and user_balance.available_balance >= 5:
                user_balance.enabled = True
            user_balance.save()

            response = {'data': 'success'}
            return Response(response, status=status.HTTP_200_OK, headers="")
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# user transfer money
class TransferMoney(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        # recipient
        # currency
        # amount
        
        try:
            recipient, currency, amount = get_user_by_name(request.data['recipient']), request.data['currency'], request.data['amount']

            if recipient == NULL:
                return Response("Invalid recipient", status = status.HTTP_400_BAD_REQUEST, headers="")

            sender_wallet, recipient_wallet = get_wallet(request.user.id), get_wallet(recipient.id)
            if sender_wallet == NULL:
                return Response("User's wallet is closed", status = status.HTTP_400_BAD_REQUEST, headers="")
            if recipient_wallet == NULL:
                return Response("Recipient's wallet is closed", status = status.HTTP_400_BAD_REQUEST, headers="")

            sender_balance, recipient_balance = get_balance(request.user.id, currency), get_balance(recipient.id, currency)
            if sender_balance.enabled == False:
                return Response("User's wallet is not active", status = status.HTTP_400_BAD_REQUEST, headers="")
            if sender_balance.available_balance < amount:
                return Response("Transfer amount is over balance", status = status.HTTP_400_BAD_REQUEST, headers="")
            if recipient_balance.enabled == False:
                return Response("Recipient's wallet is not active", status = status.HTTP_400_BAD_REQUEST, headers="")

            # save new transaction
            new_transaction = UserBalanceHistory(
                currency = currency,
                sender = request.user,
                recipient = recipient,
                amount = amount,
                time = int(time.time()),
                fee = 0,
                confirmed = True
            )
            new_transaction.save()

            # remove sender's balance
            sender_balance.available_balance -= amount
            sender_balance.save()

            # add recipient's balance
            recipient_balance.available_balance += amount
            recipient_balance.save()
            
            response = {"data": {'tx_id': new_transaction.id}}
            return Response(response, status=status.HTTP_200_OK, headers="")
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# user balance history
class GetActivities(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        # currency
        
        userbalanceshistory = UserBalanceHistory.objects.all().filter(Q(sender = request.user.id, currency = request.data['currency']) | Q(recipient = request.user.id, currency = request.data['currency'])).order_by('-time')
        list = serialize_transactions(userbalanceshistory)
        for ax in list:
            ax['confirmed'] = int(ax['confirmed'])
        return Response({'data': list})

# get transactions waiting for confirm
class GetWaitingActivities(APIView):
    # authentication_classes = [TokenAuthentication, ]
    # permission_classes = [IsAuthenticated, ]
    def post(self, request):
        waiting_transactions = UserBalanceHistory.objects.all().filter(confirmed = False).order_by('-time')
        list = serialize_transactions(waiting_transactions)
        for ax in list:
            ax['confirmed'] = int(ax['confirmed'])
        return Response({'data': list})