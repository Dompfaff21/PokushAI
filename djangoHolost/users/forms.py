from django import forms
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm, PasswordResetForm, SetPasswordForm
from django.contrib.auth.models import User
from .models import Profile
from recipe.models import Posts


class SignUpForm(UserCreationForm):
    phone = forms.CharField(max_length=20, required=True, widget=forms.TextInput(attrs={
        'placeholder': 'Номер телефона', 'data-mask': "+7 (000)-000-00-00"}))

    class Meta:
        model = User
        fields = ('username', 'phone', 'email', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={
                'placeholder': 'Логин'}),
            'email': forms.EmailInput(attrs={
                'placeholder': 'E-mail'}),
        }

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Логин занят.")
        return username

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if Profile.objects.filter(phone=phone).exists():
            raise forms.ValidationError("Номер телефона уже используется.")
        if len(phone) < 18:
            raise forms.ValidationError("Номер телефона введён неверно.")
        return phone

    def clean_password(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Пароли не совпадают.")
        return cleaned_data

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({'placeholder': 'Пароль'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Повторите пароль'})
        self.fields['password1'].required = True
        self.fields['password2'].required = True
        self.fields['email'].required = True


class LoginForm(forms.Form):
    name = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Логин'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Пароль'}))

    class Meta:
        model = User
        fields = ('name', 'password',)


class CustomPasswordResetForm(PasswordResetForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'placeholder': 'E-mail'
        })
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not User.objects.filter(email=email).exists():
            raise forms.ValidationError("Эта почта не зарегистрирована")
        return email


class CustomSetPasswordForm(SetPasswordForm):
    error_messages = {
        'password_mismatch': "Пароли не совпадают."
    }
    new_password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Новый пароль'
        }), strip=False
    )
    new_password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Повторите пароль'
        })
    )


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email']
        widgets = {
            'username': forms.TextInput(attrs={
                'placeholder': 'Логин'}),
            'email': forms.EmailInput(attrs={
                'placeholder': 'E-mail'}),
        }


class UserUpdateProfileForm(forms.ModelForm):
    phone = forms.CharField(max_length=20, required=True, widget=forms.TextInput(attrs={
        'placeholder': 'Номер телефона', 'data-mask': "+7 (000)-000-00-00"}))

    class Meta:
        model = Profile
        fields = ['phone', 'image']

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if len(phone) < 18:
            raise forms.ValidationError("Номер телефона введён неверно.")
        return phone


class CustomPasswordChangeForm(PasswordChangeForm):
    error_messages = {
        'password_mismatch': "Новые пароли не совпадают.",
        'password_incorrect': "Неверный пароль. Повторите ввод."
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['old_password'].widget.attrs.update({'placeholder': 'Старый пароль'})
        self.fields['new_password1'].widget.attrs.update({'placeholder': 'Новый пароль'})
        self.fields['new_password2'].widget.attrs.update({'placeholder': 'Повторите пароль'})
        self.fields['new_password1'].required = True
        self.fields['new_password2'].required = True


class EditRecipe(forms.ModelForm):
    class Meta:
        model = Posts
        fields = ('post_image', 'title', 'description')
        widgets = {
            'title': forms.TextInput(attrs={
                'placeholder': 'Заголовок'})
        }