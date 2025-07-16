from django.test import TestCase

from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import Profile

class TestModelProfile(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='testuser1',
            password='user_test_pass',
            email='test@mail.com'
        )
        cls.profile = Profile.objects.create(
            user=cls.user,
            phone='+7 (000)-000-00-00'
        )

    def test_profile_creation(self):
        self.assertEquals(Profile.objects.count(), 1)
        self.assertEquals(self.user.profile, self.profile)

    def tset_one_to_one_relationship(self):
        with self.assertRaises(Exception):
            Profile.objects.create(user=self.user, phone='+7 (000)-000-00-00')

    def test_profile_fields(self):
        self.assertEquals(self.profile.phone, '+7 (000)-000-00-00')

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

class UserUpdatePasswordViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='userPass',
            password='oldpassword',
        )

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_success_change(self):
        url = '/api/v1/users/user/profile/password_reset/'
        data = {
            'old_password': 'oldpassword',
            'new_password1': 'new_password',
            'new_password2': 'new_password'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('new_password'))

    def test_uncorrected_data(self):
        url = '/api/v1/users/user/profile/password_reset/'
        data = {
            'old_password': 'wrongoldpassword',
            'new_password1': 'wrongnew_password',
            'new_password2': 'anothernew_password'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_without_token(self):
        url = '/api/v1/users/user/profile/password_reset/'
        data = {
            'old_password': 'oldpassword',
            'new_password1': 'new_password',
            'new_password2': 'new_password'
        }

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'Требуется авторизация')