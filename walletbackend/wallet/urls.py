from django.urls import path, include
from .views import WalletViewSet, ChangeWalletName, CloseWallet

urlpatterns = [
    path('get_info', WalletViewSet.as_view(), name = 'wallet_get_info'),
    path('change_name', ChangeWalletName.as_view(), name='wallet_change_name'),
    path('close', CloseWallet.as_view(), name = 'wallet_close'),
    path('crypto/', include('crypto.urls')),
    path('fiat/', include('fiat.urls')),
]