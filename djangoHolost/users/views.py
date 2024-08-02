from django.shortcuts import render

# Create your views here.
def login_user(request):
    return render(request, 'user.html')

def registrate(request):
    return render(request, 'reg.html')