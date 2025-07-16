from django.urls import path, include
from .views import *

app_name = 'recipe'
urlpatterns = [
    path('recip/create/', RecipeCreatePostView.as_view()),
    path('recip/update/<int:pk>/', RecipeUpdatePostView.as_view()),

]