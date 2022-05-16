from msvcrt import getwch
from django.urls import path, reverse, include, resolve
from django.test import SimpleTestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from fiat.models import UserBalance
from wallet.models import Wallet
from rest_framework.views import APIView
from .views import RegisterUserAPIView, WalletViewSet, ChangeWalletName, CloseWallet, CustomObtainAuthToken, LogoutViewSet

class ApiUrlsTests(SimpleTestCase):
    def test_register_is_resolved(self):
        url = reverse('register')
        self.assertEquals(resolve(url).func.view_class, RegisterUserAPIView)
        
    def test_login_is_resolved(self):
        url = reverse('login')
        self.assertEquals(resolve(url).func.view_class, CustomObtainAuthToken)

    def test_get_info_is_resolved(self):
        url = reverse('wallet_get_info')
        self.assertEquals(resolve(url).func.view_class, WalletViewSet)
        
    def test_change_name_is_resolved(self):
        url = reverse('wallet_change_name')
        self.assertEquals(resolve(url).func.view_class, ChangeWalletName)
        
    def test_close_is_resolved(self):
        url = reverse('wallet_close')
        self.assertEquals(resolve(url).func.view_class, CloseWallet)
        
    def test_logout_is_resolved(self):
        url = reverse('logout')
        self.assertEquals(resolve(url).func.view_class, LogoutViewSet)

register_data = {
    'username': 'test',
    'email': 'test@example.com',
    'password': 'testtesttes',
    'password2': 'testtesttes',
    'first_name': 'test',
    'last_name': 'test',
}

class RegisterTest(APITestCase):
    register_url = reverse('register')
    
    def test(self):
        response = self.client.post(self.register_url, register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class LoginTest(APITestCase):
    register_url = reverse('register')
    login_url = reverse('login')
    
    def setUp(self):
        self.client.post(self.register_url, register_data, format='json')
    
    def test(self):
        response = self.client.post(self.login_url, register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class GetWalletInfoTest(APITestCase):
    register_url = reverse('register')
    login_url = reverse('login')
    get_info_url = reverse('wallet_get_info')
    
    def setUp(self):
        self.client.post(self.register_url, register_data, format='json')
        token = self.client.post(self.login_url, register_data, format='json').data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    def test_unathenticated(self):
        self.client.force_authenticate(user=None, token=None)
        response = self.client.post(self.get_info_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test(self):
        response = self.client.post(self.get_info_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ChangeWalletNameTest(APITestCase):
    register_url = reverse('register')
    login_url = reverse('login')
    get_info_url = reverse('wallet_get_info')
    change_name_url = reverse('wallet_change_name')
    
    def setUp(self):
        self.client.post(self.register_url, register_data, format='json')
        token = self.client.post(self.login_url, register_data, format='json').data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    def test_unathenticated(self):
        self.client.force_authenticate(user=None, token=None)
        response = self.client.post(self.change_name_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test(self):
        response = self.client.post(self.change_name_url, {'name': 'abc'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.get_info_url)
        self.assertEqual(response.data['data']['name'], 'abc')

class CloseWalletTest(APITestCase):
    register_url = reverse('register')
    login_url = reverse('login')
    get_info_url = reverse('wallet_get_info')
    close_url = reverse('wallet_close')
    
    def setUp(self):
        self.client.post(self.register_url, register_data, format='json')
        token = self.client.post(self.login_url, register_data, format='json').data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    def test_unathenticated(self):
        self.client.force_authenticate(user=None, token=None)
        response = self.client.post(self.close_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_close(self):
        response = self.client.post(self.close_url, format='json')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.get_info_url)
        self.assertEqual(response.data['data']['closed'], 1)

    def test_close_with_fund(self):
        user = User.objects.get(username = register_data['username'])
        UserBalance.objects.create(user = user, currency = 'USD', available_balance = 5)
        
        response = self.client.post(self.close_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'Wallet is not empty')