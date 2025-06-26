from django.test import TestCase
from users.models import Profile
from django.contrib.auth.models import User

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