from django.urls import path, include
from . import views
from django.contrib.auth.views import LogoutView
from .views import get_num_forms
from django.conf import settings
from django.conf.urls.static import static

