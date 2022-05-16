from django.urls import path, include
from .views import SetApiKey, GetBalance, TransferCoin, GetLastTransactions

urlpatterns = [
    path('set_api_key', SetApiKey.as_view(), name='crypto_set_api_key'),
    path('get_balance', GetBalance.as_view(), name='crypto_get_balance'),
    path('transfer', TransferCoin.as_view(), name='crypto_transfer'),
    path('get_activities', GetLastTransactions.as_view(), name='crypto_get_activities'),
]