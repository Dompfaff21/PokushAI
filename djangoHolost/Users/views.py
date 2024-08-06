from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from .models import Profile
from .forms import  SignUpForm, LoginForm


# Create your views here.
def register(request):
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
        return redirect('signup')

def login(request):
    form = LoginForm(request.POST)

    if form.is_valid():
        username = form.cleaned_data.get('name')
        password = form.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        login(request, user)
        return redirect('/')
    else:
        return redirect('signup')


def signup(request):
    context = {
        'form': SignUpForm(),
        'form1': LoginForm()
    }
    return render(request, 'signup.html', context)