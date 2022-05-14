from django.urls import path, include
from .viewsactivity import UserViewSet, UserBalanceTotal, UserRequestTopUp, ConfirmUserTopUp, UserTransferMoney, UserBankApiSetView, BankApiSetView, LogoutViewSet

urlpatterns = [
    path('user/', UserViewSet.as_view()),
    path('logout/<int:userid>/', LogoutViewSet.as_view()),
    path('totalbalance/<int:userid>/', UserBalanceTotal.as_view()),
    path('bankuser/<int:userid>/', UserBankApiSetView.as_view()),
    path('bank/', BankApiSetView.as_view()),
    path('topup/', UserRequestTopUp.as_view()),
    path('confirmtopup/<int:userbalancehistoryid>/', ConfirmUserTopUp.as_view()),
    path('transfer/', UserTransferMoney.as_view())
]