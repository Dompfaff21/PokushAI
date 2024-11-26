from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.app, name='app'),
    path('recipe/', views.recipe_result, name='recipe_result'),
    path('recipe/<str:dish>/', views.recipe_detail, name='recipe_detail'), 
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)