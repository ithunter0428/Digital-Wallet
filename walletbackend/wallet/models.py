from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wallet_name = models.CharField(max_length=250, null = False, default=None)
    # closed = models.BooleanField(default=False)