from django.contrib import messages
from django.contrib.auth import login, authenticate, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.messages.views import SuccessMessageMixin
from django.core.exceptions import PermissionDenied
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
import os
from recipe.models import Posts
from django.db import transaction
from .forms import SignUpForm, LoginForm, CustomSetPasswordForm, CustomPasswordResetForm, UserUpdateForm, UserUpdateProfileForm, CustomPasswordChangeForm
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from .models import Profile
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
import logging

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
                form2 = CustomPasswordChangeForm(request.user, request.POST)
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
        form2 = CustomPasswordChangeForm(request.user)
        form3 = Posts.objects.filter(author=request.user)

    content = {
        'form': form,
        'form1': form1,
        'form2': form2,
        'form3': form3
    }
    return render(request, 'profile.html', content)

def delete_post(request, id):
    post = get_object_or_404(Posts, pk=id)
    if post.post_image:
        image_path = post.post_image.path
        if os.path.exists(image_path):
            os.remove(image_path)
    post.delete()
    messages.success(request, 'Рецепт успешно удален')
    return redirect('profile')

def edit_post(request, id):
    post = get_object_or_404(Posts, pk=id)

    if request.user == post.author:
        return render(request, 'edit_post.html', {'post': post})
    else:
        raise PermissionDenied()

def update_post(request, pk):
    if request.method == 'POST':
        data = get_object_or_404(Posts, id=pk)

        old_image_path = None
        if data.post_image:
            old_image_path = data.post_image.path

        data.title = request.POST.get('title')
        data.description = request.POST.get('description')

        new_image = request.FILES.get('post_image')
        if new_image:
            data.post_image = new_image

        data.save()

        if new_image and old_image_path and os.path.exists(old_image_path):
            os.remove(old_image_path)

        messages.success(request, 'Рецепт редактирован')
    
    return redirect('profile')

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Пользователь успешно зарегистрирован",
                "userId": user.id
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                return Response({
                    "message": "Вход выполнен успешно",
                    "userId": user.id
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "error": "Неверное имя пользователя или пароль"
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            profile = Profile.objects.get(user=user.id)
            if profile.image:
                image_url = request.build_absolute_uri(profile.image.url)
                return Response({
                    "username": user.username,
                    "userId": user.id,
                    "userImage": image_url
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "username": user.username,
                    "userId": user.id,
                }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)
   
logger = logging.getLogger(__name__)

class UserProfileUpdatePicsView(APIView):
    def post(self, request):
        user = User.objects.get(id=request.POST.get('userId'))
        profile = Profile.objects.get(user=user.id)
        if request.FILES:
            old_image_path = None
            if profile.image:
                old_image_path = profile.image.path
            new_image = request.FILES.get('image')
            if new_image:
                profile.image = new_image
            profile.save()
            if new_image and old_image_path and os.path.exists(old_image_path):
                os.remove(old_image_path)
            return Response({"message": "Смена фото успешна"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Ошибка данных"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileDeleteImageView(APIView):
    def delete(self, request, id):      #request не удалять, без него метод не работает, потому что Кирилл его добавил у себя в мобилке, зачем то
        user = User.objects.get(id=id)
        profile = Profile.objects.get(user=user)
        if profile.image:
            image_path = profile.image.path
            if os.path.exists(image_path):
                os.remove(image_path)
        profile.image.delete()
        profile.image = None
        profile.save()
        return Response(status=status.HTTP_200_OK)

class UserProfileUpdateView(APIView):
    def post(self, request):
        user = User.objects.get(id=request.data.get('userId'))
        profile = Profile.objects.get(user=user)
        if profile:
            user.username = request.data.get('username')
            user.email = request.data.get('email')
            profile.phone = request.data.get('phone')
            user.save()
            profile.save()
            return Response(
                {"message": "Смена данных успешна"},
                status=status.HTTP_200_OK)
        else:
            return Response({"message": "Ошибка"}, status=status.HTTP_404_NOT_FOUND)
