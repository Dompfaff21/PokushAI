from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('posts', views.posts, name='posts'),
    path('new_post', views.new_post, name='new_post'),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)