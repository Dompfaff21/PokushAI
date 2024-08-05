from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms.widgets import NumberInput

class SignUpForm(UserCreationForm):
    phone = forms.CharField(max_length=11, required=True, label="Номер телефона")
    birth_date = forms.DateField(label="Дата рождения", widget =NumberInput(attrs={'type':'date'}))

    class Meta:
        model = User
        fields = ('username', 'phone', 'email', 'birth_date', 'password1', 'password2',)