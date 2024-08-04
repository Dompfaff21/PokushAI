from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login_user, name='accounts'),
    path('new', views.registrate, name='new'),
]