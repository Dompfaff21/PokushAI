from django.test import TestCase
from users.models import Profile
from django.contrib.auth.models import User
from users.forms import SignUpForm, LoginForm, CustomPasswordResetForm, CustomSetPasswordForm


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

class TestFormLoginForm(TestCase):
    def test_valid_form(self):
        User.objects.create_user(username='logintest', password='PasswordForTest01')
        form_data = {
            'name': 'logintest',
            'password': 'PasswordForTest01'
        }

        form = LoginForm(data=form_data)
        self.assertTrue(form.is_valid())

class TestFormCustomPasswordResetForm(TestCase):
    def test_valid_form(self):
        User.objects.create_user(username='testemail', password='PasswordForTest01', email='test@test.com')
        form_data = {'email': 'test@test.com'}

        form = CustomPasswordResetForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_email_exist(self):
        User.objects.create_user(username='testemail1', password='PasswordForTest01', email='test1@test.com')
        form_data = {'email': 'uncorrect@test.com'}

        form = CustomPasswordResetForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEquals(form.errors['email'], ['Эта почта не зарегистрирована'])

class TestFormCustomSetPasswordForm(TestCase):
    def test_valid_form(self):
        user = User.objects.create_user(username='testuser', password='ChangePasswordTest01')
        form_data = {
            'new_password1': 'PasswordForTest01',
            'new_password2': 'PasswordForTest01'
        }

        form = CustomSetPasswordForm(data=form_data, user=user)
        self.assertTrue(form.is_valid())

    def test_password_mismatch(self):
        user = User.objects.create_user(username='testuser', password='ChangePasswordTest01')
        form_data = {
            'new_password1': 'PasswordForTest01',
            'new_password2': 'PasswordForTest02'
        }

        form = CustomSetPasswordForm(data=form_data, user=user)
        self.assertFalse(form.is_valid())
        self.assertEquals(form.error_messages['password_mismatch'], 'Пароли не совпадают.')


"""Тесты вьюх"""