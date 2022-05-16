from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserBalance(models.Model):
    currency = models.CharField(max_length=5, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    available_balance = models.FloatField(default=0)
    current_balance = models.FloatField(default=0)
    enabled = models.BooleanField(default=False)

class UserBalanceHistory(models.Model):
    currency = models.CharField(max_length=5, blank=False, null=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='%(class)s_requests_recipient')
    amount = models.FloatField(default=0)
    time = models.IntegerField(blank=False, null=False)
    fee = models.FloatField(default=0)
    confirmed = models.BooleanField(default=False)