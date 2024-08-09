from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_page, name='home'),
    path('about', views.about_page, name='about')
]