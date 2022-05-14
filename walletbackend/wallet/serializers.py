from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TypeActivity, Bank, BankBalance, BankBalanceHistory, UserBalance, UserBalanceHistory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

class TypeActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeActivity
        fields = ['id', 'title']
        read_only_fields = ['id']

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'code']
        read_only_fields = ['id']

class BankBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankBalance
        fields = ['id', 'bank', 'balance', 'balance_achieve', 'enable']
        read_only_fields = ['id']

class BankBalanceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BankBalanceHistory
        fields = ['id', 'bank_balance', 'balance_before', 'balance_after', 'activity', 'typeActivity', 'ip', 'location', 'user_agent', 'author']
        read_only_fields = ['id']

class UserBalanceHistorySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    bank = serializers.SerializerMethodField()
    class Meta:
        model = UserBalanceHistory
        fields = ['id', 'user', 'bank', 'user_balance', 'balance_before', 'balance_after', 'activity', 'typeActivity', 'ip', 'location', 'user_agent', 'author', 'send_to','send_to_bank', 'çonfirm']
        read_only_fields = ['id']
        write_only_fields=['user', 'bank']
        
class UserBalanceSerializer(serializers.ModelSerializer):
    # total_balance = serializers.SerializerMethodField()
    histories = UserBalanceHistorySerializer(many=True, read_only=True)
    bank_name = serializers.CharField(
        source='bank.code', read_only=True)
    class Meta:
        model = UserBalance
        fields = ['id', 'bank','bank_name', 'user', 'balance', 'balance_achieve', 'histories']
        read_only_fields = ['id','histories', 'bank_name']
    
    # def get_total_balance(self, obj):
    #     totalbalance = UserBalance.objects.all().filter(user=request.data['userid']).aggregate(total_price=Sum('per_piece_price'))
    #     return totalbalance["total_balance"]

