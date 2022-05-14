import stripe
from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# Create your views here.
stripe.api_key = 'sk_test_51Kz7q2GskKmf1K7OlSl1g4FzpBZE0O4allVgSzgHTCoWCFyRyNeOfagIMMvuB72CpARRsrGIqsicLh8OngGOJpSL00FnWbJznR'

class TestPayment(APIView):
    # authentication_classes = [TokenAuthentication, ]
    # permission_classes = [IsAuthenticated, ]

    def post(self, request):
        test_payment_intent = stripe.PaymentIntent.create(
            amount=1000, currency='pln', 
            payment_method_types=['card'],
            receipt_email='test@example.com')
        return Response(status=status.HTTP_200_OK, data=test_payment_intent)

class SaveStripeInfo(APIView):
    def post(self, request):
        data = request.data
        email = data['email']
        payment_method_id = data['payment_method_id']
        extra_msg = '' # add new variable to response message

        # checking if customer with provided email already exists
        customer_data = stripe.Customer.list(email=email).data   
                
        # if the array is empty it means the email has not been used yet  
        if len(customer_data) == 0:
            # creating customer
            customer = stripe.Customer.create(
                email=email, 
                payment_method=payment_method_id,
                invoice_settings={
                    'default_payment_method': payment_method_id
                })
        else:
            customer = customer_data[0]
            extra_msg = "Customer already existed."

        stripe.PaymentIntent.create(
            customer=customer, 
            payment_method=payment_method_id,  
            currency='pln', # you can provide any currency you want
            amount=1500,
            confirm=True)     # it equals 9.99 PLN

        stripe.Subscription.create(
            customer=customer,
            items=[{
                'price': 'price_1KzD3NGskKmf1K7Ol5czjte1' #here paste your price id
            }]
        )
        
        return Response(status=status.HTTP_200_OK, data={
            'message': 'Success', 
            'data': {'customer_id': customer.id, 'extra_msg': extra_msg}
        })                  