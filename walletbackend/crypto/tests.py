from django.urls import path, reverse, include, resolve
from django.test import SimpleTestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.views import APIView
from .views import SetApiKey, GetBalance, TransferCoin, GetLastTransactions

api_key1 = {
    'bitcoin': '20d5-05aa-2c7d-01ff',
    'litecoin': 'c4a0-e551-f12c-99c1',
    'dogecoin': 'aea7-f29b-af25-996c',
    'secret_pin': 'snape1112snape111',
}

api_key2 = {
    'bitcoin': 'd0f7-52ca-dce8-2155',
    'litecoin': '754e-2dd0-d798-c39a',
    'dogecoin': 'cdad-64fa-b4f0-44e2',
    'secret_pin': 'snape1112snape111',
}

# class ApiUrlsTests(SimpleTestCase):
#     def test_set_api_key_is_resolved(self):
#         url = reverse('crypto_set_api_key')
#         self.assertEquals(resolve(url).func.view_class, SetApiKey)
        
#     def test_get_balance_is_resolved(self):
#         url = reverse('crypto_get_balance')
#         self.assertEquals(resolve(url).func.view_class, GetBalance)
        
#     def test_transfer_is_resolved(self):
#         url = reverse('crypto_transfer')
#         self.assertEquals(resolve(url).func.view_class, TransferCoin)
        
#     def test_get_activities_is_resolved(self):
#         url = reverse('crypto_get_activities')
#         self.assertEquals(resolve(url).func.view_class, GetLastTransactions)


# class SetApiKeyTests(APITestCase):
#     set_api_key_url = reverse('crypto_set_api_key')

#     def setUp(self):
#         self.user = User.objects.create_user(
#             username='admin', password='admin')
#         self.token = Token.objects.create(user=self.user)
#         self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

#     def test_unathenticated(self):
#         self.client.force_authenticate(user=None, token=None)
#         response = self.client.post(self.set_api_key_url)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_authenticated(self):
#         response = self.client.post(self.set_api_key_url, api_key1, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# class GetBalanceTests(APITestCase):
#     set_api_key_url = reverse('crypto_set_api_key')
#     get_balance_url = reverse('crypto_get_balance')

#     def setUp(self):
#         self.user = User.objects.create_user(
#             username='admin', password='admin')
#         self.token = Token.objects.create(user=self.user)
#         self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

#         self.client.post(self.set_api_key_url, api_key1, format='json')

#     def test_unathenticated(self):
#         self.client.force_authenticate(user=None, token=None)
#         response = self.client.post(self.get_balance_url)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_get_bitcoin_balance(self):
#         data = {
#             'currency': 'bitcoin'
#         }
#         response = self.client.post(self.get_balance_url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['data']['network'], 'BTCTEST')

#     def test_get_litecoin_balance(self):
#         data = {
#             'currency': 'litecoin'
#         }
#         response = self.client.post(self.get_balance_url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['data']['network'], 'LTCTEST')

#     def test_get_dogecoin_balance(self):
#         data = {
#             'currency': 'dogecoin'
#         }
#         response = self.client.post(self.get_balance_url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['data']['network'], 'DOGETEST')

#     def test_invalid_currency(self):
#         data = {
#             'currency': 'mycoin'
#         }
#         response = self.client.post(self.get_balance_url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# class TransferCoinTests(APITestCase):
#     set_api_key_url = reverse('crypto_set_api_key')
#     get_balance_url = reverse('crypto_get_balance')
#     transfer_url = reverse('crypto_transfer')

#     def setUp(self):
#         self.user1 = User.objects.create_user(
#             username='admin', password='admin')
#         self.token1 = Token.objects.create(user=self.user1)
#         self.client1 = APIClient()
#         self.client1.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)

#         self.client1.post(self.set_api_key_url, api_key1, format='json')

#         data = {
#             'currency': 'dogecoin'
#         }
#         self.balance1 = self.client1.post(self.get_balance_url, data, format='json').data['data']
        
#         self.user2 = User.objects.create_user(
#             username='test', password='test')
#         self.token2 = Token.objects.create(user=self.user2)
#         self.client2 = APIClient()
#         self.client2.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)

        
#         self.client2.post(self.set_api_key_url, api_key2, format='json')

#         data = {
#             'currency': 'dogecoin'
#         }
#         self.balance2 = self.client2.post(self.get_balance_url, data, format='json').data['data']

#     def test_unathenticated(self):
#         self.client1.force_authenticate(user=None, token=None)
#         response = self.client1.post(self.transfer_url)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_transfer_over_balance(self):
#         data = {
#             'currency': 'dogecoin',
#             'amount': self.balance1['available_balance'] + 1,
#             'recipient': self.balance2['address']
#         }
#         response = self.client1.post(self.transfer_url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_transfer(self):
#         transfer_amount = 0.0001
#         data = {
#             'currency': 'dogecoin',
#             'amount': transfer_amount,
#             'recipient': self.balance2['address']
#         }
#         response = self.client1.post(self.transfer_url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         new_balance1 = self.client1.post(self.get_balance_url, data, format='json').data['data']
#         self.assertLess(new_balance1['available_balance'], self.balance1['available_balance'] - transfer_amount)

#         new_balance2 = self.client2.post(self.get_balance_url, data, format='json').data['data']
#         self.assertEqual(new_balance2['available_balance'], self.balance2['pending_received_balance'] + transfer_amount)

class GetActivityTests(APITestCase):
    set_api_key_url = reverse('crypto_set_api_key')
    transfer_url = reverse('crypto_transfer')
    get_balance_url = reverse('crypto_get_balance')
    get_activities_url = reverse('crypto_get_activities')

    def setUp(self):
        self.user1 = User.objects.create_user(
            username='admin', password='admin')
        self.token1 = Token.objects.create(user=self.user1)
        self.client1 = APIClient()
        self.client1.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)

        self.client1.post(self.set_api_key_url, api_key1, format='json').data['data']

        data = {
            'currency': 'dogecoin'
        }
        self.balance1 = self.client1.post(self.get_balance_url, data, format='json').data['data']
        
        self.user2 = User.objects.create_user(
            username='test', password='test')
        self.token2 = Token.objects.create(user=self.user2)
        self.client2 = APIClient()
        self.client2.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)

        self.client2.post(self.set_api_key_url, api_key2, format='json')

        data = {
            'currency': 'dogecoin'
        }
        self.balance2 = self.client2.post(self.get_balance_url, data, format='json').data['data']

    def test_unathenticated(self):
        self.client1.force_authenticate(user=None, token=None)
        response = self.client1.post(self.get_activities_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_activities(self):
        data = {'currency': 'dogecoin'}
        response = self.client1.post(self.get_activities_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)

    def test_after_transfer(self):
        transfer_amount = 1
        data = {
            'currency': 'dogecoin',
            'amount': transfer_amount,
            'recipient': self.balance2['address']
        }
        self.client1.post(self.transfer_url, data, format='json')
        
        data = {'currency': 'dogecoin'}
        tx_list = self.client1.post(self.get_activities_url, data, format='json').data['data']
        last_tx = tx_list[0]
        self.assertEqual(last_tx['sender'], self.balance1['address'])
        self.assertEqual(last_tx['recipient'], self.balance2['address'])
        self.assertEqual(float(last_tx['amount']), float(transfer_amount))