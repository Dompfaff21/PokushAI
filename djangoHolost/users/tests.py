from django.test import TestCase
from users.models import Profile
from django.contrib.auth.models import User
from users.forms import SignUpForm


"""Тесты моделей"""

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


"""Тесты форм"""

class TestFormSignUpForm(TestCase):
    def test_valid_form(self):
        form_data = {
            'username': 'testuser1',
            'phone': '+7 (000)-000-00-00',
            'email': 'test@mail.com',
            'password1': 'testpass125',
            'password2': 'testpass125'
        }

        form = SignUpForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_uniq_username(self):
        User.objects.create_user(username='testuser1', password='testpass')

        form_data = {
            'username': 'testuser1',
            'phone': '+7 (000)-000-00-00',
            'email': 'test@mail.com',
            'password1': 'testpass125',
            'password2': 'testpass125'
        }

        form = SignUpForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEquals(form.errors['username'], ['Логин занят.'])

    def test_password_mismatch(self):
        form_data = {
            'username': 'testuser1',
            'phone': '+7 (000)-000-00-00',
            'email': 'test@mail.com',
            'password1': 'testpass125',
            'password2': 'PasswordForTest125'
        }

        form = SignUpForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('Введенные пароли не совпадают.', form.errors['password2'])

    def test_len_phone(self):
        form_data = {
            'username': 'testuser1',
            'phone': '+7 (000)-000-00-00000000',
            'email': 'test@mail.com',
            'password1': 'testpass125',
            'password2': 'testpass125'
        }

        form = SignUpForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn(
            'Убедитесь, что это значение содержит не более 20 символов (сейчас 24).',
            form.errors['phone']
        )

    def test_uniq_phone(self):
        user = User.objects.create_user(username='testuser2', password='passForTest')
        Profile.objects.create(user=user, phone='+7 (000)-000-00-11')

        form_data = {
            'username': 'testuser3',
            'phone': '+7 (000)-000-00-11',
            'email': 'test@mail.com',
            'password1': 'testpass125',
            'password2': 'testpass125'
        }

        form = SignUpForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEquals(form.errors['phone'], ['Номер телефона уже используется.'])


"""Тесты вьюх"""