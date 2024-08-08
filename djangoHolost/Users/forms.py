from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class SignUpForm(UserCreationForm):
    phone = forms.CharField(max_length = 11, required = True, widget = forms.TextInput(attrs = {
        'placeholder': 'Введите номер телефона'}))

    class Meta:
        model = User
        fields = ('username', 'phone', 'email')
        widgets = {
            'username': forms.TextInput(attrs = {
                    'placeholder':'Введите логин'}),
            'email': forms.EmailInput(attrs = {
                    'placeholder': 'Введите E-mail'}),
        }

    def __init__(self,*args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({'placeholder': 'Введите пароль'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Повторите пароль'})

class LoginForm(forms.Form):
    name = forms.CharField(widget=forms.TextInput(attrs = {
            'placeholder':'Введите логин'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs = {
            'placeholder':'Введите пароль'}))

    class Meta:
        model = User
        fields = ('name', 'password')