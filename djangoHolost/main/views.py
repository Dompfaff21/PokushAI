from django.shortcuts import render

# Create your views here.
def index_page(request):
    return render(request, 'index.html')

def about_page(request):
    return render(request, 'about_us.html')