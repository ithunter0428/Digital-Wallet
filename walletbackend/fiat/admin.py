from django.contrib import admin
from fiat.models import CurrencyBalance, CurrencyBalanceHistory, UserBalance, UserBalanceHistory
# Register your models here.

admin.site.register(CurrencyBalance)
admin.site.register(CurrencyBalanceHistory)
admin.site.register(UserBalance)
admin.site.register(UserBalanceHistory)