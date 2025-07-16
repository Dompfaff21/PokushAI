from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import *
from djangoHolost.permissions import *
from rest_framework import generics


class RecipeCreatePostView(generics.CreateAPIView):
    serializer_class = RecipePostCreateSerializer
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class RecipeUpdatePostView(generics.RetrieveUpdateAPIView):
    serializer_class = RecipePostUpdateSerializer
    queryset = Posts.objects.all()
    authentication_classes = [JWTAuthentication]