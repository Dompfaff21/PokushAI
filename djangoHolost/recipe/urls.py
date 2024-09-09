from django.urls import path
from . import views

urlpatterns = [
    path('posts', views.posts, name='posts'),
    path('new_post', views.new_post, name='new_post'),
]