from django.urls import path, include
from .views import *

app_name = 'users'
urlpatterns = [
    path('user/register/', CreateUserView.as_view()),
    path('user/login/', LoginUserView.as_view(), name='login'),
    path('user/list/', ListUserView.as_view()),
    path('user/posts/', UserPostGetView.as_view()),
    path('user/profile/<int:pk>/', UserGetProfileView.as_view()),
    path('user/profile/update/', UserProfileUpdateView.as_view()),
    path('user/profile/password_update/', UserUpdatePasswordView.as_view()),
    path('user/profile/image_delete/', UserProfileDeleteImageView.as_view()),

]