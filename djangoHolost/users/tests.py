from django.test import TestCase

from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status

from users.models import Profile


class LoginUserViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )

    def test_successful_login(self):
        url = '/api/v1/users/user/login/'
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Вход выполнен успешно')
        self.assertEqual(response.data['userId'], self.user.id)

    def test_invalid_credentials(self):
        url = '/api/v1/users/user/login/'
        data = {
            'username': 'wronguser',
            'password': 'wrongpass'
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Неверное имя пользователя или пароль')