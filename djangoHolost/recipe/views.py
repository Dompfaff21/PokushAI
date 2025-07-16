from .serializers import *
from djangoHolost.permissions import *
from rest_framework import generics, permissions


class RecipeCreatePostView(generics.CreateAPIView):
    serializer_class = RecipePostCreateSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class RecipeUpdatePostView(generics.RetrieveUpdateAPIView):
    serializer_class = RecipePostUpdateSerializer
    queryset = Posts.objects.all()
    permission_classes = (IsOwnerOrReadOnly, )