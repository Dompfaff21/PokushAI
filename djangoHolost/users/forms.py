from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class SignUpForm(UserCreationForm):
    phone = forms.CharField(max_length=20, required=True, widget=forms.TextInput(attrs={
        'placeholder': 'Введите номер телефона', 'data-mask': "+7 (000)-000-00-00"}))
    error_messages = {
        'password_mismatch': "Пароли не совпадают!",
        'username': {
            'unique': 'Логин занят!'
        }
    }

    class Meta:
        model = User
        fields = ('username', 'phone', 'email', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={
                    'placeholder': 'Введите логин'}),
            'email': forms.EmailInput(attrs={
                    'placeholder': 'Введите E-mail'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({'placeholder': 'Введите пароль'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Повторите пароль'})
        self.fields['password1'].required = True
        self.fields['password2'].required = True

class LoginForm(forms.Form):
    name = forms.CharField(widget=forms.TextInput(attrs={
            'placeholder': 'Введите логин'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
            'placeholder': 'Введите пароль'}))

    class Meta:
        model = User
        fields = ('name', 'password',)