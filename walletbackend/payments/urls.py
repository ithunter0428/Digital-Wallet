from django.urls import path, include
from .views import TestPayment, SaveStripeInfo

urlpatterns = [
    path('test-payment', TestPayment.as_view()),
    path('save-stripe-info/', SaveStripeInfo.as_view())
]