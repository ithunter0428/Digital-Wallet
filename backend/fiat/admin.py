from django.contrib import admin
from fiat.models import UserBalance, UserBalanceHistory
# Register your models here.

admin.site.register(UserBalance)
admin.site.register(UserBalanceHistory)