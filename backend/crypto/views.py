from asyncio.windows_events import NULL
from django.http import HttpResponse
from django.db.models import Avg, Count, Min, Sum
from django.conf import settings 
# from django.contrib.gis.utils import GeoIP

from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer

from django.contrib.auth.models import User
from .models import UserCryptoAPIKey

from block_io import BlockIo
from sentry_sdk import capture_exception
import json

# get block.io and default account address for user and curerncy
def get_block_io(userid, currency):
    api_key = UserCryptoAPIKey.objects.get(user = userid)
    if currency == 'bitcoin':
        key = api_key.bitcoin
    elif currency == 'litecoin':
        key = api_key.litecoin
    elif currency == 'dogecoin':
        key = api_key.dogecoin
    else:
        return (NULL, NULL)
    block_io = BlockIo(key, api_key.secret_pin, settings.API_VERSION)
    address = block_io.get_address_by_label(label = 'default')['data']
    return (block_io, address)

# set crypto api key and secret pin
class SetApiKey(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        # bitcoin
        # litecoin
        # dogecoin
        # secret_pin

        user = User.objects.get(id = request.user.id)

        try:
            UserCryptoAPIKey.objects.update_or_create(
                user = user,
                defaults = {
                    'bitcoin': request.data['bitcoin'],
                    'litecoin': request.data['litecoin'],
                    'dogecoin': request.data['dogecoin'],
                    'secret_pin': request.data['secret_pin']
                }
            )
            BlockIo(request.data['bitcoin'], request.data['secret_pin'], settings.API_VERSION).get_balance()
            BlockIo(request.data['litecoin'], request.data['secret_pin'], settings.API_VERSION).get_balance()
            BlockIo(request.data['dogecoin'], request.data['secret_pin'], settings.API_VERSION).get_balance()
        except Exception as e:
            capture_exception(e)
            return Response('Invalid API Key', status=status.HTTP_400_BAD_REQUEST, headers="")

        response = {"data": "success"}
        return Response(response, status=status.HTTP_200_OK, headers="")

# get balance
class GetBalance(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        # currency

        try:
            block_io, address = get_block_io(request.user.id, request.data['currency'])
            if block_io == NULL:
                return Response('Invalid currency', status = status.HTTP_400_BAD_REQUEST, headers="")

            response = {'data': address}
            return Response(response, status=status.HTTP_200_OK, headers="")
        except Exception as e:
            capture_exception(e)
            return Response('Error', status = status.HTTP_400_BAD_REQUEST, headers="")

# transfer coin
class TransferCoin(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        # currency
        # amount
        # recipient

        try:
            block_io, address = get_block_io(request.user.id, request.data['currency'])
            if block_io == NULL:
                return Response('Invalid currency', status = status.HTTP_400_BAD_REQUEST, headers="")
                
            if float(address['available_balance']) <= float(request.data['amount']):
                return Response('Transfer amount is over balance', status = status.HTTP_400_BAD_REQUEST, headers="")

            prepared_transaction = block_io.prepare_transaction(to_addresses = request.data['recipient'], amount=str(request.data['amount']))
            # review its response
            # for in-depth information about the transaction you will create, look at the prepared_transaction object directly
            print(json.dumps(block_io.summarize_prepared_transaction(prepared_transaction)))
            # once satisfied, create the transaction and sign it
            created_transaction_and_signatures = block_io.create_and_sign_transaction(prepared_transaction)
            # inspect the transaction_data (particularly the tx_hex) to ensure it is what you wanted
            # once satisfied, submit the transaction to Block.io for its signature + broadcast to the peer-to-peer network
            response = block_io.submit_transaction(transaction_data=created_transaction_and_signatures)
            
            print("Coins sent. Transaction ID=", response['data']['txid'])
            return Response(response, status=status.HTTP_200_OK, headers="")
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")

# get last transactions
class GetLastTransactions(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        # currency

        try:
            block_io, address = get_block_io(request.user.id, request.data['currency'])
            if block_io == NULL:
                return Response('Invalid currency', status = status.HTTP_400_BAD_REQUEST, headers="")
                
            sent = block_io.get_transactions(type='sent')['data']['txs']
            received = block_io.get_transactions(type='received')['data']['txs']
            tx_list = sorted(sent + received, key = lambda i: i['time'], reverse = True)
            response = []

            for tx in tx_list:
                raw_tx = block_io.get_raw_transaction(txid = tx['txid'])
                try:
                    recipient = tx['amounts_sent'][0]['recipient']
                    amount = tx['amounts_sent'][0]['amount']
                except KeyError:
                    recipient = tx['amounts_received'][0]['recipient']
                    amount = tx['amounts_received'][0]['amount']
                confirmed, currency = 0, request.data['currency']
                if currency == 'bitcoin' and tx['confirmations'] >= 3:
                    confirmed = 1
                if currency == 'litecoin' and tx['confirmations'] >= 5:
                    confirmed = 1
                if currency == 'dogecoin' and tx['confirmations'] >= 10:
                    confirmed = 1
                response.append({
                    'id': tx['txid'],
                    'sender': tx['senders'][0],
                    'recipient': recipient,
                    'amount': amount,
                    'time': tx['time'],
                    'fee': raw_tx['data']['network_fee'],
                    'confirmed': confirmed
                })
            
            response = {'data': response}
            return Response(response, status=status.HTTP_200_OK, headers="")
        except Exception as e:
            capture_exception(e)
            return Response("Error", status = status.HTTP_400_BAD_REQUEST, headers="")