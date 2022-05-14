from django.http import HttpResponse
from django.db.models import Avg, Count, Min, Sum
# from django.contrib.gis.utils import GeoIP

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer

from django.contrib.auth.models import User
from .serializers import UserSerializer, TypeActivitySerializer, BankSerializer, BankBalanceSerializer, BankBalanceHistorySerializer, UserBalanceSerializer, UserBalanceHistorySerializer
from .models import TypeActivity, Bank, BankBalance, BankBalanceHistory, UserBalance, UserBalanceHistory


# g = GeoIP()
def get_typeActivityID(id):
    try:
        return TypeActivity.objects.get(id=id)
    except TypeActivity.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_bankID(id):
    try:
        return Bank.objects.get(id=id)
    except Bank.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_bankbalanceID(id):
    try:
        return BankBalance.objects.get(id=id)
    except BankBalance.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_bankbalance(bankid):
    try:
        return BankBalance.objects.get(bank=bankid)
    except BankBalance.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_userbalance(userid, bankid):
    try:
        return UserBalance.objects.get(user=userid, bank=bankid)
    except UserBalance.DoesNotExist:
        balance = UserBalance(bank=get_bankID(bankid), user=get_userID(userid), balance=0, balance_achieve=0)
        balance.save()
        return UserBalance.objects.get(user=userid, bank=bankid)
        # return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_userbalanceID(id):
    try:
        return UserBalance.objects.get(id=id)
    except UserBalance.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_userbalancehistory(id):
    try:
        return UserBalanceHistory.objects.get(id=id)
    except UserBalanceHistory.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_totalbalance(userid):
    userbalances=UserBalance.objects.all().filter(user=userid)
    return userbalances.aggregate(Sum('balance'))

def get_user(username):
    try:
        return User.objects.get(username=username)
    except UserBalanceHistory.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

def get_userID(id):
    try:
        return User.objects.get(id=id)
    except UserBalanceHistory.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

# user login
class UserViewSet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        user = get_user(request.data['username'])
        serializer = UserSerializer(user)
        return Response(serializer.data)
#user logout
class LogoutViewSet(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request, userid):
        userToken = Token.objects.get(user=userid)
        userToken.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#bank
class BankApiSetView(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        banks = Bank.objects.all()
        serializer = BankSerializer(banks, many=True)
        return Response(serializer.data)

#user bank
class UserBankApiSetView(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get(self, request, userid):
        banks = UserBalance.objects.all().filter(user=userid)
        serializer = UserBalanceSerializer(banks, many=True)
        return Response(serializer.data)

#user balance total
class UserBalanceTotal(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get(self, request, userid):
        print('UserBalanceTotal')
        totalbalance = get_totalbalance(userid)
        response = {"data": totalbalance}
        return Response(response, status=status.HTTP_200_OK, headers="")

#user balance history
class UserBalanceHistoryApiSetView(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def get(self, request, userid):
        userbalanceshistory = UserBalance.objects.all().filter(user=userid)
        serializer = UserBalanceSerializer(userbalanceshistory, many=True)
        return Response(serializer.data)

# user request topup
class UserRequestTopUp(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        # user
        # bank
        # balance_after
        
        userbalance = get_userbalance(request.data['user'], request.data['bank'])

        senderActivity=UserBalanceHistory(user_balance=userbalance, balance_before=userbalance.balance, balance_after= userbalance.balance+int(request.data['balance_after']), activity='Top Up', typeActivity=get_typeActivityID(2), ip=request.META['REMOTE_ADDR'], location='', user_agent='', author='', send_to=get_userID(request.data['user']), send_to_bank=get_bankID(request.data['bank']), confirm=False)
        senderActivity.save()
        
        totalbalance = get_totalbalance(request.data['user'])
        response = {"data": totalbalance}
        return Response(response, status=status.HTTP_200_OK, headers="")

class ConfirmUserTopUp(APIView):
    # authentication_classes = [TokenAuthentication, ]
    # permission_classes = [IsAuthenticated, ]
    def get(self, request, userbalancehistoryid):
        userbalancehistory = get_userbalancehistory(userbalancehistoryid)
        userbalance = get_userbalanceID(userbalancehistory.user_balance_id)
        bank = get_bankID(userbalance.bank_id)
        bankbalance = get_bankbalance(bank.id)


        # Add uang ke user balance
        changeBalance = userbalancehistory.balance_after-userbalancehistory.balance_before
        newBalanceUser=0
        if(userbalance.balance == userbalancehistory.balance_before):
            newBalanceUser = userbalancehistory.balance_after
        else:
            newBalanceUser = userbalance.balance+changeBalance
            
        userbalance.balance=newBalanceUser
        userbalance.save()
        
        
        # Add uang ke bank balance history
        newBankBalance = bankbalance.balance + changeBalance
        
        b = BankBalanceHistory(bank_balance=bankbalance, balance_before=bankbalance.balance, balance_after=newBankBalance, activity=userbalancehistory.activity, typeActivity=userbalancehistory.typeActivity, ip = userbalancehistory.ip, location=userbalancehistory.location, user_agent=userbalancehistory.user_agent, author=userbalancehistory.author)
        b.save()
        
        bankbalance.balance=newBankBalance
        bankbalance.save()
        
        # Confim uang Top Up
        userbalancehistory.confirm = True
        userbalancehistory.save()

        totalbalance = get_totalbalance(userbalance.user_id)
        response = {"data": totalbalance}
        return Response(response, status=status.HTTP_200_OK, headers="")



# user transfer uang
class UserTransferMoney(APIView):
    authentication_classes = [TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        # User
        # user
        # bank
        # user_agent -> send to
        # balance_after -> amount
        # send_to_bank

        userbalance = get_userbalance(request.data['user'], request.data['bank'])
        userSendTo = get_user(request.data['user_agent'])

        senderBalanceAfter=userbalance.balance-int(request.data['balance_after'])
        senderActivity=UserBalanceHistory(user_balance=userbalance, balance_before=userbalance.balance, balance_after= senderBalanceAfter, activity='Transfer', typeActivity=get_typeActivityID(1), ip=request.META['REMOTE_ADDR'], location='', user_agent='', author='', send_to=userSendTo, send_to_bank=get_bankID(request.data['send_to_bank']), confirm=True)
        senderActivity.save()
        
        userbalance.balance=senderBalanceAfter
        userbalance.save()

        receiverbalance=get_userbalance(userSendTo.id, request.data['send_to_bank'])

        receiverbalanceAfter=receiverbalance.balance+int(request.data['balance_after'])
        receiverActivity=UserBalanceHistory(user_balance=receiverbalance, balance_before=receiverbalance.balance, balance_after= receiverbalanceAfter, activity='Receive Money', typeActivity=get_typeActivityID(3), ip=request.META['REMOTE_ADDR'], location='', user_agent='', author='', send_to=get_userID(request.data['user']), send_to_bank=get_bankID(request.data['bank']), confirm=True)
        receiverActivity.save()
        
        receiverbalance.balance=receiverbalanceAfter
        receiverbalance.save()

        # Bank
        bankbalance = get_bankbalance(request.data['bank'])
        newBankBalance = bankbalance.balance - int(request.data['balance_after'])
        
        b = BankBalanceHistory(bank_balance=bankbalance, balance_before=bankbalance.balance, balance_after=newBankBalance, activity='Transfer', typeActivity=get_typeActivityID(1), ip=request.META['REMOTE_ADDR'], location='', user_agent='', author='')
        b.save()
        
        bankbalance.balance=newBankBalance
        bankbalance.save()


        bankReceiveBalance = get_bankbalance(request.data['send_to_bank'])
        newBankReceiveBalance = bankReceiveBalance.balance + int(request.data['balance_after'])
        
        bReceive = BankBalanceHistory(bank_balance=bankReceiveBalance, balance_before=bankReceiveBalance.balance, balance_after=newBankReceiveBalance, activity='Receive Money', typeActivity=get_typeActivityID(3), ip=request.META['REMOTE_ADDR'], location='', user_agent='', author='')
        bReceive.save()
        
        bankReceiveBalance.balance=newBankReceiveBalance
        bankReceiveBalance.save()

        totalbalance = get_totalbalance(request.data['user'])
        response = {"data": totalbalance}
        return Response(response, status=status.HTTP_200_OK, headers="")

        

