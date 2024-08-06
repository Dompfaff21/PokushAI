from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User

class SignUpForm(UserCreationForm):
    phone = forms.CharField(max_length=11, required=True, widget=forms.TextInput(attrs={'placeholder':'Введите номер телефона'}))

    class Meta:
        model = User
        fields = ('username', 'phone', 'email', 'password1', 'password2',)
        widgets = {
            'username': forms.TextInput(attrs={'placeholder':'Введите логин'}),
            'phone': forms.TextInput(attrs={'placeholder': 'Введите номер телефона'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Введите E-mail'}),
            'password1': forms.PasswordInput(attrs={'placeholder': 'Введите пароль'}),
            'password2': forms.PasswordInput(attrs={'placeholder': 'Повторите пароль'})
        }

class LoginForm(AuthenticationForm):
    name = forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Введите логин'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Введите пароль'}))

    class Meta:
        model = User
        fields = ('name', 'password')