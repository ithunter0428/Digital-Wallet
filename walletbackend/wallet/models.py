from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class TypeActivity(models.Model):
    title= models.CharField(max_length=32, blank=False, null=False)
    
    def __str__(self):
        return self.title

class Bank(models.Model):
    code = models.CharField(max_length=150, blank=False, null=False)
    
    def __str__(self):
        return self.code

class BankBalance(models.Model):
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    balance = models.IntegerField(default=0)
    balance_achieve = models.IntegerField(default=0)
    enable=models.BooleanField(default=False)

class BankBalanceHistory(models.Model):
    bank_balance = models.ForeignKey(BankBalance, on_delete=models.CASCADE)
    balance_before = models.IntegerField(default=0)
    balance_after = models.IntegerField(default=0)
    activity = models.CharField(max_length=32, blank=False, null=False)
    typeActivity = models.ForeignKey(TypeActivity, on_delete=models.CASCADE)
    ip = models.CharField(max_length=32, blank=False, null=False)
    location = models.CharField(max_length=250, blank=False, null=False)
    user_agent = models.CharField(max_length=150, blank=False, null=False)
    author = models.CharField(max_length=150, blank=False, null=False)


class UserBalance(models.Model):
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    balance = models.IntegerField(default=0)
    balance_achieve = models.IntegerField(default=0)


class UserBalanceHistory(models.Model):
    user_balance = models.ForeignKey(UserBalance, on_delete=models.CASCADE)
    balance_before = models.IntegerField(default=0)
    balance_after = models.IntegerField(default=0)
    activity = models.CharField(max_length=32, blank=False, null=False)
    typeActivity = models.ForeignKey(TypeActivity, on_delete=models.CASCADE)
    ip = models.CharField(max_length=32, blank=False, null=False)
    location = models.CharField(max_length=250, blank=False, null=False)
    user_agent = models.CharField(max_length=150, blank=False, null=False)
    author = models.CharField(max_length=150, blank=False, null=False)
    send_to = models.ForeignKey(User, on_delete=models.CASCADE)
    send_to_bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    confirm=models.BooleanField(default=False)