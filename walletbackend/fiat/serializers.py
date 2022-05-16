from rest_framework import serializers

from wallet.serializers import UserSerializer
from .models import UserBalance, UserBalanceHistory

from sentry_sdk import capture_exception

# class TypeActivitySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TypeActivity
#         fields = ['id', 'title']
#         read_only_fields = ['id']

# class BankSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Bank
#         fields = ['id', 'code']
#         read_only_fields = ['id']

class UserBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBalance
        fields = ['id', 'currency', 'user', 'available_balance', 'current_balance', 'enabled', 'closed']
        read_only_fields = ['id']

# class BankBalanceHistorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BankBalanceHistory
#         fields = ['id', 'bank_balance', 'balance_before', 'balance_after', 'activity', 'typeActivity', 'ip', 'location', 'user_agent', 'author']
#         read_only_fields = ['id']

class UserBalanceHistorySerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    recipient = UserSerializer()
    class Meta:
        model = UserBalanceHistory
        fields = ['id', 'currency', 'sender', 'recipient', 'amount', 'time', 'fee', 'confirmed']
        read_only_fields = ['id']
        
# class UserBalanceSerializer(serializers.ModelSerializer):
#     # total_balance = serializers.SerializerMethodField()
#     histories = UserBalanceHistorySerializer(many=True, read_only=True)
#     bank_name = serializers.CharField(
#         source='bank.code', read_only=True)
#     class Meta:
#         model = UserBalance
#         fields = ['id', 'bank','bank_name', 'user', 'balance', 'balance_achieve', 'histories']
#         read_only_fields = ['id','histories', 'bank_name']
    
#     # def get_total_balance(self, obj):
#     #     totalbalance = UserBalance.objects.all().filter(user=request.data['userid']).aggregate(total_price=Sum('per_piece_price'))
#     #     return totalbalance["total_balance"]

