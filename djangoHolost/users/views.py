from django.contrib import messages
from django.contrib.auth import login, authenticate, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.messages.views import SuccessMessageMixin
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
import os
from recipe.models import Posts
from django.db import transaction
from .forms import SignUpForm, LoginForm, CustomSetPasswordForm, CustomPasswordResetForm, UserUpdateForm, UserUpdateProfileForm, CustomPasswordChangeForm, EditRecipe
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from .models import Profile
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer

from recipe.models import Steps, Like


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
        form3 = Posts.objects.filter(author=request.user).order_by('-created_at')

    profiles = Profile.objects.all()
    liked_posts = Like.objects.filter(user=request.user).values_list('post_id', flat=True)
    content = {
        'form': form,
        'form1': form1,
        'form2': form2,
        'form3': form3,
        'profiles': profiles,
        'liked_posts': liked_posts,
    }
    return render(request, 'profile.html', content)

def delete_post(request, id):
    post = get_object_or_404(Posts, pk=id)

    if post.post_image:
        image_path = post.post_image.path
        if os.path.exists(image_path):
            os.remove(image_path)

    steps = Steps.objects.filter(recipe=post.id)
    for step in steps:
        if step.step_image:
            step_image_path = step.step_image.path
            if os.path.exists(step_image_path):
                os.remove(step_image_path)
        step.delete()

    post.delete()
    messages.success(request, 'Рецепт успешно удален')
    return redirect('profile')

def edit_post(request, id):
    post = get_object_or_404(Posts, pk=id)
    steps = Steps.objects.filter(recipe=post.id)
    total_steps = steps.count()

    if request.method == 'POST':
        form = EditRecipe(request.POST, request.FILES, instance=post)
        old_image_path = None

        if post.post_image:
            old_image_path = post.post_image.path

        new_image = request.FILES.get('post_image')
        if new_image:
            post.post_image = new_image

        if new_image and old_image_path and os.path.exists(old_image_path):
            os.remove(old_image_path)

        if form.is_valid():
            recipe = form.save(commit=False)
            recipe.save()

            total_forms = int(request.POST.get('steps-TOTAL_FORMS'))

            for i in range(total_forms):
                step_description = request.POST.get(f'steps-{i}-step_des')
                step_image = request.FILES.get(f'steps-{i}-step_image')

                if i < len(steps):
                    step = steps[i]
                    step.step_des = step_description

                    if step_image:
                        if step.step_image:
                            old_step_image_path = step.step_image.path
                            if os.path.exists(old_step_image_path):
                                os.remove(old_step_image_path)
                        step.step_image = step_image
                    
                    step.save()
                else:
                    if step_description:
                        Steps.objects.create(
                            recipe=recipe,
                            step_des=step_description,
                            step_image=step_image,
                        )

            if len(steps) > total_forms:
                steps_to_delete = steps[total_forms:]
                for step in steps_to_delete:
                    if step.step_image:
                        old_step_image_path = step.step_image.path
                        if os.path.exists(old_step_image_path):
                            os.remove(old_step_image_path)
                    step.delete()

            messages.success(request, 'Рецепт успешно редактирован')
            return redirect('profile')
        else:
            for error in form.errors.values():
                messages.error(request, error)
            return redirect('edit_post', id=id)
    else:
        form = EditRecipe(instance=post)

    if request.user == post.author:
        return render(request, 'edit_post.html', {
            'form': form,
            'post': post,
            'steps': steps,
            'total_steps': total_steps,
        })
    else:
        raise PermissionDenied()

def get_num_forms(post):
    steps = Steps.objects.filter(recipe=post.id).values('step_des', 'step_image')
    step_list = list(steps)
    return JsonResponse({'numForms': len(step_list), 'steps': step_list})

def profile_view(request, id):
    profile = get_object_or_404(Profile, pk=id)
    all_recipe = Posts.objects.filter(author=profile.user).order_by('-created_at')
    all_profiles = Profile.objects.all()
    liked_posts = Like.objects.filter(user=request.user).values_list('post_id', flat=True)
    return render(request, 'recipe_author.html', {'form': profile, 
                                                  'post': all_recipe,
                                                  'username': profile.user.username,
                                                  'profiles': all_profiles,
                                                  'liked_posts': liked_posts})

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Пользователь успешно зарегистрирован"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(username=serializer.data['username'], password=serializer.data['password'])
            if user:
                return Response({"message": "Авторизация успешна"})
            return Response({"error": "Неверные учетные данные"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

