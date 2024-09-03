from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.messages.views import SuccessMessageMixin
from django.shortcuts import render, redirect
from django.urls import reverse_lazy

from .models import Profile
from .forms import SignUpForm, LoginForm, CustomSetPasswordForm, CustomPasswordResetForm, UserUpdateForm, UserUpdateProfileForm
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView

def signup(request):
    if request.method == 'POST':
        if 'reg' in request.POST:
            form = SignUpForm(request.POST)
            if form.is_valid():
                user = form.save()
                Profile.objects.create(user=user, phone=form.cleaned_data.get('phone'))
                username = form.cleaned_data.get('username')
                password = form.cleaned_data.get('password1')
                user = authenticate(username=username, password=password)
                login(request, user)
                return redirect('/')
            else:
                for error in form.errors.values():
                    messages.error(request, error)
                return redirect('signup')

        elif 'log' in request.POST:
            form = LoginForm(request.POST)
            if form.is_valid():
                user = authenticate(username=form.cleaned_data.get('name'), password=form.cleaned_data.get('password'))
                if user is not None:
                    login(request, user)
                    return redirect('/')
                else:
                    messages.error(request, 'Логин и/или пароль неверный.')
                    return redirect('signup')
    content = {
        'form': SignUpForm(),
        'form1': LoginForm(),
    }
    return render(request, 'signup.html', content)

class CustomPasswordResetViews(SuccessMessageMixin, PasswordResetView):
    template_name = 'password_reset.html'
    email_template_name = 'password_reset_email.html'
    form_class = CustomPasswordResetForm
    success_url = reverse_lazy('home')
    success_message = 'Письмо с инструкцией смены пароля отправлена Вам на почту'

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            for error in form.errors.values():
                messages.error(request, error)
            return redirect('password-reset')

class CustomPasswordResetConfirmViews(SuccessMessageMixin, PasswordResetConfirmView):
    template_name = 'password_reset_confirm.html'
    email_template_name = 'password_reset_email.html'
    form_class = CustomSetPasswordForm
    success_url = reverse_lazy('signup')
    success_message = 'Вы успешно сменили пароль'

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            for error in form.errors.values():
                messages.error(request, error)
            return self.form_invalid(form)

@login_required
def profile(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)
        form1 = UserUpdateProfileForm(request.POST, instance=request.user.profile)
        if form.is_valid() and form1.is_valid():
            form.save()
            form1.save()
            messages.success(request, f'Ваш профиль успешно обновлен')
            return redirect('profile')
        else:
            for error in form.errors.values() or form1.errors.values():
                messages.error(request, error)
            return redirect('profile')
    else:
        form = UserUpdateForm(instance=request.user)
        form1 = UserUpdateProfileForm(instance=request.user.profile)

    content = {
        'form': form,
        'form1': form1
    }
    return render(request, 'profile.html', content)