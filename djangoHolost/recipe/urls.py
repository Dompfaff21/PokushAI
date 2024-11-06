from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('posts', views.posts, name='posts'),
    path('new_post', views.new_post, name='new_post'),
    path('like/<int:post_id>/', views.like_post, name='like_post'),
    path('post_view_increment/<int:id>/', views.PostViewIncrement, name='post_view_increment'),
    path('post_view/<int:id>', views.PostView, name='post_view')
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)