from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from .models import Profile
from .forms import  SignUpForm, LoginForm


# Create your views here.
def signup(request):
    error_message = ''
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

    elif 'log' in request.POST:
        form = LoginForm(request.POST)
        if form.is_valid():
            user = authenticate(username=form.cleaned_data.get('name'), password=form.cleaned_data.get('password'))
            if user is not None:
                login(request, user)
                return redirect('/')
            else:
                error_message = 'Неверный логин и/или пароль'

    content = {
        'form': SignUpForm(),
        'form1': LoginForm(),
        'error_message': error_message
    }
    return render(request, 'signup.html', content)