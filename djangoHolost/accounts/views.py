from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from .models import Profile
from .forms import  SignUpForm

# Create your views here.
def login_user(request):
    return render(request, 'registration/login.html')

def registrate(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            Profile.objects.create(user=user, phone=form.cleaned_data.get('phone'), birth_date=form.cleaned_data.get('birth_date'))
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('/')
    else:
        form = SignUpForm()
    return render(request, 'registration/registration.html', {'form': form})