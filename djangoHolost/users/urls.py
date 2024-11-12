from django.urls import path, include
from . import views
from django.contrib.auth.views import LogoutView
from .views import get_num_forms
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
        path('login', views.signup, name='signup'),
        path('logout', LogoutView.as_view(), name='logout'),
        path('password-reset/', views.CustomPasswordResetViews.as_view(), name='password-reset'),
        path('password_reset_confirm/<uidb64>/<token>/',
             views.CustomPasswordResetConfirmViews.as_view(),
             name='password-reset-confirm'),
        path('profile', views.profile, name='profile'),
        path('delete_post/<int:id>', views.delete_post, name='delete_post'),
        path('edit_post/<int:id>', views.edit_post, name='edit_post'),
        path('api/get_num_forms/<int:post_id>/', get_num_forms),
        path('profile_view/<int:id>', views.profile_view, name='profile_view'),
        path('like/', include('recipe.urls')),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)