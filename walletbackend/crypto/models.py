from django.db import models
from django.contrib.auth.models import User

class UserCryptoAPIKey(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    bitcoin = models.CharField(max_length = 20, blank = False, null = False)
    litecoin = models.CharField(max_length = 20, blank = False, null = False)
    dogecoin = models.CharField(max_length = 20, blank = False, null = False)
    secret_pin = models.CharField(max_length = 250, blank = False, null = False)