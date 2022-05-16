from django.urls import path, include
from .views import GetBalance, TopUpFromStripe, ConfirmTopUpTransaction, TransferMoney, GetActivities, GetWaitingActivities

urlpatterns = [
    path('get_balance', GetBalance.as_view(), name = 'fiat_get_balance'),
    path('topup', TopUpFromStripe.as_view(), name = 'fiat_topup'),
    path('waiting_confirm', GetWaitingActivities.as_view(), name = 'fiat_waiting_confirm'),
    path('confirm_topup', ConfirmTopUpTransaction.as_view(), name = 'fiat_confirm_topup'),
    path('transfer', TransferMoney.as_view(), name = 'fiat_transfer'),
    path('get_activities', GetActivities.as_view(), name = 'fiat_get_activities')
]