from django.shortcuts import render
from django.conf import settings

def index_page(request):
    return render(request, 'index.html')

def about_page(request):
    return render(request, 'about_us.html')

def error_404_view(request, exception):
    return render(request, '404.html')