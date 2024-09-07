from django.contrib import messages
from django.contrib.auth import login, authenticate, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.forms import PasswordChangeForm
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
import os
from django.db import transaction
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
    default_image_name = 'no_photo.png'
    old_image_path = None
    old_image_name = None
    if request.user.profile.image:
        old_image_path = request.user.profile.image.path
        old_image_name = os.path.basename(old_image_path)
        if 'profile_pics' not in old_image_path:
            old_image_path = os.path.join(r'C:\Users\Admin\Desktop\PokushAI\djangoHolost\media\profile_pics', old_image_name)
    if request.method == 'POST':
        if 'action' in request.POST:
            action = request.POST.get('action')
            if action == 'update':
                form = UserUpdateForm(request.POST, instance=request.user)
                form1 = UserUpdateProfileForm(request.POST, request.FILES, instance=request.user.profile)

                if form.is_valid() and form1.is_valid():
                    with transaction.atomic():
                        form1.save()
                        new_image = request.user.profile.image
                        new_image_path = new_image.path if new_image else None
                        if old_image_path and old_image_path != new_image_path:
                            if old_image_name != default_image_name:
                                if old_image_path and os.path.exists(old_image_path):
                                    os.remove(old_image_path)
                        form.save()
                    messages.success(request, 'Ваш профиль успешно обновлен')
                else:
                    for error in form.errors.values() or form1.errors.values():
                        messages.error(request, error)

            elif action == 'delete_avatar':
                if request.user.profile.image:
                    request.user.profile.image.delete()
                    request.user.profile.image = None
                    request.user.profile.save()
                    messages.success(request, 'Аватар успешно удален')

            elif action == 'change_password':
                form2 = PasswordChangeForm(request.user, request.POST)
                if form2.is_valid():
                    user = form2.save()
                    update_session_auth_hash(request, user)
                    messages.success(request, 'Пароль сменен успешно')
                    return redirect('profile')
                else:
                    for error in form2.errors.values():
                        messages.error(request, error)

        return redirect('profile')

    else:
        form = UserUpdateForm(instance=request.user)
        form1 = UserUpdateProfileForm(instance=request.user.profile)
        form2 = PasswordChangeForm(request.user)

    content = {
        'form': form,
        'form1': form1,
        'form2': form2
    }
    return render(request, 'profile.html', content)