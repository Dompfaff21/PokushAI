from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from django.contrib.auth import views as auth_views

urlpatterns = [
        path('login', views.signup, name='signup'),
        path('logout', LogoutView.as_view(), name='logout'),
        path('password-reset/', views.CustomPasswordResetViews.as_view(), name='password-reset'),
        path('password_reset_confirm/<uidb64>/<token>/',
             auth_views.PasswordResetConfirmView.as_view(),
             name='password_reset_confirm'),
        path('password_reset_complete/',
        auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'),
             name='password_reset_complete'),
        path('password-reset/done/',
        auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'),
             name='password_reset_done'),
]