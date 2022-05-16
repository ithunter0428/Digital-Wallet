from msvcrt import getwch
from django.urls import path, reverse, include, resolve
from django.test import SimpleTestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from wallet.models import Wallet
from rest_framework.views import APIView
from .views import GetBalance, TopUpFromStripe, ConfirmTopUpTransaction, TransferMoney, GetActivities, GetWaitingActivities

class ApiUrlsTests(SimpleTestCase):
    def test_get_balance_is_resolved(self):
        url = reverse('fiat_get_balance')
        self.assertEquals(resolve(url).func.view_class, GetBalance)

    def test_topup_is_resolved(self):
        url = reverse('fiat_topup')
        self.assertEquals(resolve(url).func.view_class, TopUpFromStripe)

    def test_confirm_topup_is_resolved(self):
        url = reverse('fiat_confirm_topup')
        self.assertEquals(resolve(url).func.view_class, ConfirmTopUpTransaction)

    def test_transfer_is_resolved(self):
        url = reverse('fiat_transfer')
        self.assertEquals(resolve(url).func.view_class, TransferMoney)

    def test_get_activities_resolved(self):
        url = reverse('fiat_get_activities')
        self.assertEquals(resolve(url).func.view_class, GetActivities)

    def test_waiting_confirm_resolved(self):
        url = reverse('fiat_waiting_confirm')
        self.assertEquals(resolve(url).func.view_class, GetWaitingActivities)

class GetBalanceTests(APITestCase):
    get_balance_url = reverse('fiat_get_balance')

    def setUp(self):
        self.user = User.objects.create_user(
            username='admin', password='admin')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_unathenticated(self):
        self.client.force_authenticate(user=None, token=None)
        response = self.client.post(self.get_balance_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_fiat_balance(self):
        data = {
            'currency': 'USD'
        }
        response = self.client.post(self.get_balance_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # print("=================get balance==", response.data)

class TopupTests(APITestCase):
    get_balance_url = reverse('fiat_get_balance')
    topup_url = reverse('fiat_topup')

    def setUp(self):
        User.objects.create_user(username='admin', password='admin')

        self.user = User.objects.create_user(
            username='user1', password='user1')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.balance = self.client.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']

    def test_unathenticated(self):
        self.client.force_authenticate(user=None, token=None)
        response = self.client.post(self.topup_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_topup_less_5(self):
        data = {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 4,
        }
        response = self.client.post(self.topup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_topup_over_500(self):
        data = {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 501,
        }
        response = self.client.post(self.topup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_topup(self):
        transfer_amount = 10
        data = {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': transfer_amount,
        }
        response = self.client.post(self.topup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        new_balance = self.client.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']
        self.assertEqual(round(new_balance['current_balance'], 5), round(transfer_amount - transfer_amount * 0.015 - 0.3, 5))

        # print("=================topup==", response.data)

class ConfirmTopupTests(APITestCase):
    get_balance_url = reverse('fiat_get_balance')
    topup_url = reverse('fiat_topup')
    confirm_topup_url = reverse('fiat_confirm_topup')

    def setUp(self):
        User.objects.create_user(username='admin', password='admin')

        self.user = User.objects.create_user(
            username='user1', password='user1')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.transfer_amount = 10
        data = {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': self.transfer_amount,
        }
        self.client.post(self.topup_url, data, format='json')
    
    def test_invalid(self):
        data = {
            'transaction': 2
        }
        response = self.client.post(self.confirm_topup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_confirm(self):
        data = {
            'transaction': 1
        }
        response = self.client.post(self.confirm_topup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        new_balance = self.client.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']
        self.assertEqual(round(new_balance['available_balance'], 5), round(self.transfer_amount - self.transfer_amount * 0.015 - 0.3, 5))
        self.assertEqual(new_balance['current_balance'], 0)

        # print("=================confirm topup==", response.data)

class TrasferTests(APITestCase):
    get_balance_url = reverse('fiat_get_balance')
    topup_url = reverse('fiat_topup')
    confirm_topup_url = reverse('fiat_confirm_topup')
    transfer_url = reverse('fiat_transfer')

    def setUp(self):
        User.objects.create_user(username='admin', password='admin')

        self.user1 = User.objects.create_user(username='user1', password='user1')
        self.wallet1 = Wallet.objects.create(user=self.user1, wallet_name='AAA')
        self.token1 = Token.objects.create(user=self.user1)
        self.client1 = APIClient()
        self.client1.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)

        data = {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 10,
        }
        self.transaction1 = self.client1.post(self.topup_url, data, format='json').data['data']

    def test_unathenticated(self):
        self.client1.force_authenticate(user=None, token=None)
        response = self.client1.post(self.transfer_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_recipient_invalid(self):
        data = {
            'currency': 'USD',
            'recipient': 'user2',
            'amount': 5,
        }
        response = self.client1.post(self.transfer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'Invalid recipient')

    def test_sender_wallet_diabled(self):
        self.user2 = User.objects.create_user(username='user2', password='user2')
        self.wallet2 = Wallet.objects.create(user=self.user2, wallet_name='BBB')

        data = {
            'currency': 'USD',
            'recipient': 'user2',
            'amount': 5,
        }
        response = self.client1.post(self.transfer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "User's wallet is not active")

    def test_recipient_wallet_diabled(self):
        user2 = User.objects.create_user(username='user2', password='user2')
        wallet2 = Wallet.objects.create(user=user2, wallet_name='BBB')
        self.client1.post(self.confirm_topup_url, {'transaction': self.transaction1['tx_id']}, format='json')

        data = {
            'currency': 'USD',
            'recipient': 'user2',
            'amount': 5,
        }
        response = self.client1.post(self.transfer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Recipient's wallet is not active")

    def test_wallet_over(self):
        user2 = User.objects.create_user(username='user2', password='user2')
        wallet2 = Wallet.objects.create(user=user2, wallet_name='BBB')
        self.client1.post(self.confirm_topup_url, {'transaction': self.transaction1['tx_id']}, format='json')
        token2 = Token.objects.create(user=user2)
        client2 = APIClient()
        client2.credentials(HTTP_AUTHORIZATION='Token ' + token2.key)
        transaction2 = client2.post(self.topup_url, {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 20,
        }, format='json').data['data']
        client2.post(self.confirm_topup_url, {'transaction': transaction2['tx_id']}, format='json')

        balance1 = self.client1.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']
        balance2 = client2.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']

        transfer_amount = balance1['available_balance'] + 1
        data = {
            'currency': 'USD',
            'recipient': 'user2',
            'amount': transfer_amount,
        }
        response = self.client1.post(self.transfer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Transfer amount is over balance")

    def test_recipient_wallet_diabled(self):
        user2 = User.objects.create_user(username='user2', password='user2')
        wallet2 = Wallet.objects.create(user=user2, wallet_name='BBB')
        self.client1.post(self.confirm_topup_url, {'transaction': self.transaction1['tx_id']}, format='json')
        token2 = Token.objects.create(user=user2)
        client2 = APIClient()
        client2.credentials(HTTP_AUTHORIZATION='Token ' + token2.key)
        transaction2 = client2.post(self.topup_url, {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 20,
        }, format='json').data['data']
        client2.post(self.confirm_topup_url, {'transaction': transaction2['tx_id']}, format='json')

        balance1 = self.client1.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']
        balance2 = client2.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']

        transfer_amount = 5
        data = {
            'currency': 'USD',
            'recipient': 'user2',
            'amount': transfer_amount,
        }
        response = self.client1.post(self.transfer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        new_balance1 = self.client1.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']
        new_balance2 = client2.post(self.get_balance_url, {'currency': 'USD'}, format='json').data['data']

        self.assertEqual(new_balance1['available_balance'], balance1['available_balance'] - transfer_amount)
        self.assertEqual(new_balance2['available_balance'], balance2['available_balance'] + transfer_amount)

        # print("=================transfer==", response.data)

class GetActivitiesTest(APITestCase):
    get_balance_url = reverse('fiat_get_balance')
    topup_url = reverse('fiat_topup')
    confirm_topup_url = reverse('fiat_confirm_topup')
    transfer_url = reverse('fiat_transfer')
    get_activities_url = reverse('fiat_get_activities')

    def setUp(self):
        User.objects.create_user(username='admin', password='admin')

        self.user1 = User.objects.create_user(
            username='user1', password='user1')
        self.token1 = Token.objects.create(user=self.user1)
        self.client1 = APIClient()
        self.client1.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)

        data = {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 10,
        }
        self.transaction1 = self.client1.post(self.topup_url, data, format='json').data['data']
        self.client1.post(self.confirm_topup_url, {'transaction': self.transaction1['tx_id']}, format='json')
        self.transaction1 = self.client1.post(self.topup_url, data, format='json').data['data']

        self.user2 = User.objects.create_user(username='user2', password='user2')
        self.token2 = Token.objects.create(user=self.user2)
        self.client2 = APIClient()
        self.client2.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        transaction2 = self.client2.post(self.topup_url, {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 20,
        }, format='json').data['data']
        self.client2.post(self.confirm_topup_url, {'transaction': transaction2['tx_id']}, format='json')

        data = {
            'currency': 'USD',
            'recipient': 'user2',
            'amount': 3,
        }
        self.client1.post(self.transfer_url, data, format='json')

        data = {
            'currency': 'USD',
            'recipient': 'user2',
            'amount': 2,
        }
        self.client1.post(self.transfer_url, data, format='json')

        data = {
            'currency': 'USD',
            'recipient': 'user1',
            'amount': 4,
        }
        self.last_tx = self.client2.post(self.transfer_url, data, format='json')

    def test_unathenticated(self):
        self.client1.force_authenticate(user=None, token=None)
        response = self.client1.post(self.get_activities_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_getlist(self):
        response = self.client1.post(self.get_activities_url, {'currency': 'USD'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # print("=================get activities==", response.data)

class GetWaitingActivitiesTest(APITestCase):
    get_balance_url = reverse('fiat_get_balance')
    topup_url = reverse('fiat_topup')
    get_activities_url = reverse('fiat_get_activities')
    get_waiting_activities_url = reverse('fiat_waiting_confirm')

    def setUp(self):
        User.objects.create_user(username='admin', password='admin')

        self.user1 = User.objects.create_user(
            username='user1', password='user1')
        self.token1 = Token.objects.create(user=self.user1)
        self.client1 = APIClient()
        self.client1.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)

    def getEmptyList(self):
        response = self.client1.post(self.get_waiting_activities_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def getAfterTopup(self):
        data = {
            'currency': 'USD',
            'stripe_secret_key': '',
            'amount': 10,
        }
        self.transaction1 = self.client1.post(self.topup_url, data, format='json').data['data']

        response = self.client1.post(self.get_waiting_activities_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
