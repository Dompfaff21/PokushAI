from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User

class SignUpForm(UserCreationForm):
    phone = forms.CharField(max_length=11, required=True)

    class Meta:
        model = User
        fields = ('username', 'phone', 'email', 'password1', 'password2',)

class LoginForm(AuthenticationForm):
    name = forms.CharField()
    password = forms.CharField()

    class Meta:
        model = User
        fields = ('name', 'password')