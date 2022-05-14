from django.http import HttpResponse

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth.models import User
from .serializers import UserSerializer, TypeActivitySerializer, BankSerializer, BankBalanceSerializer, BankBalanceHistorySerializer, UserBalanceSerializer, UserBalanceHistorySerializer
from .models import TypeActivity, Bank, BankBalance, BankBalanceHistory, UserBalance, UserBalanceHistory


# Create your views here. This is for admin.py
class TypeActivityViewSet(viewsets.ModelViewSet):
    queryset=TypeActivity.objects.all()
    serializer_class=TypeActivitySerializer 

class BankViewSet(viewsets.ModelViewSet):
    queryset=Bank.objects.all()
    serializer_class=BankSerializer 

class BankBalanceViewSet(viewsets.ModelViewSet):
    queryset=BankBalance.objects.all()
    serializer_class=BankBalanceSerializer 

class BankBalanceHistoryViewSet(viewsets.ModelViewSet):
    queryset=BankBalanceHistory.objects.all()
    serializer_class=BankBalanceHistorySerializer 

class UserBalanceViewSet(viewsets.ModelViewSet):
    queryset=UserBalance.objects.all()
    serializer_class=UserBalanceSerializer 

class UserBalanceHistoryViewSet(viewsets.ModelViewSet):
    queryset=UserBalanceHistory.objects.all()
    serializer_class=UserBalanceHistorySerializer 

