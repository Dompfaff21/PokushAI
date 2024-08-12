from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView

urlpatterns = [
        path('login', views.signup, name='signup'),
        path('logout', LogoutView.as_view(template_name="signup.html"), name='logout')
]