from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('users/', include('users.urls')),
    path('recipe/', include('recipe.urls'))
]

handler404 = 'main.views.error_404_view'