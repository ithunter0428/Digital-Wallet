from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# class TypeActivity(models.Model):
#     title= models.CharField(max_length=32, blank=False, null=False)
    
#     def __str__(self):
#         return self.title

# class Currency(models.Model):
#     code = models.CharField(max_length=150, blank=False, null=False)
    
#     def __str__(self):
#         return self.code

class CurrencyBalance(models.Model):
    currency = models.CharField(max_length=5, blank=False, null=False)
    # balance = models.IntegerField(default=0)
    # balance_achieve = models.IntegerField(default=0)
    enable=models.BooleanField(default=False)

class CurrencyBalanceHistory(models.Model):
    currency_balance = models.ForeignKey(CurrencyBalance, on_delete=models.CASCADE)
    # balance_before = models.IntegerField(default=0)
    # balance_after = models.IntegerField(default=0)
    # activity = models.CharField(max_length=32, blank=False, null=False)
    # typeActivity = models.ForeignKey(TypeActivity, on_delete=models.CASCADE)
    # ip = models.CharField(max_length=32, blank=False, null=False)
    # location = models.CharField(max_length=250, blank=False, null=False)
    # user_agent = models.CharField(max_length=150, blank=False, null=False)
    # author = models.CharField(max_length=150, blank=False, null=False)

class UserBalance(models.Model):
    currency = models.CharField(max_length=5, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    available_balance = models.FloatField(default=0)
    current_balance = models.FloatField(default=0)
    enabled = models.BooleanField(default=False)
    closed = models.BooleanField(default=False)

class UserBalanceHistory(models.Model):
    currency = models.CharField(max_length=5, blank=False, null=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_recipient')
    amount = models.FloatField(default=0)
    time = models.IntegerField(blank=False, null=False)
    fee = models.FloatField(default=0)
    confirmed = models.BooleanField(default=False)