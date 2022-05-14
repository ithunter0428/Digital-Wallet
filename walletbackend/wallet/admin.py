from django.contrib import admin
from wallet.models import TypeActivity, Bank, BankBalance, BankBalanceHistory, UserBalance, UserBalanceHistory
# Register your models here.

admin.site.register(TypeActivity)
admin.site.register(Bank)
admin.site.register(BankBalance)
admin.site.register(BankBalanceHistory)
admin.site.register(UserBalance)
admin.site.register(UserBalanceHistory)