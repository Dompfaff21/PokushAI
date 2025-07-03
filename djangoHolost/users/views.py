import os

from django.db.models import Prefetch

from djangoHolost.permissions import *
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import *
from .models import Profile
from recipe.models import Posts


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserDetailSerializer
    
class ListUserView(generics.ListAPIView):
    serializer_class = ListUsersSerializer
    queryset = User.objects.all()

class LoginUserView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                return Response({
                    "message": "Вход выполнен успешно",
                    "userId": user.id
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "error": "Неверное имя пользователя или пароль"
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserGetProfileView(generics.RetrieveAPIView):
    serializer_class = DetailProfileSerializer
    queryset = User.objects.all()

class UserProfileDeleteImageView(generics.DestroyAPIView):
    queryset = Profile.objects.all()
    #permission_classes = (IsOwnerOrReadOnly,)
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        profile = self.get_object()

        if not profile.image:
            return Response(
                {"error": "Фото не существует"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.image.delete(save=False)
        profile.image = None
        profile.save()

        return Response(
            {"message": "Фото успешно удалено"},
            status=status.HTTP_204_NO_CONTENT
        )

class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = DetailProfileSerializer
    #permission_classes = (IsOwnerOrReadOnly,)

    def get_queryset(self):
        return User.objects.select_related('profile')
        
class UserUpdatePasswordView(APIView):
    def post(self, request):
        user = User.objects.get(id=request.data.get('userId'))
        if user.check_password(request.data.get('oldPassword')):
            user.set_password(request.data.get('password'))
            user.save()
            return Response({"message": "Успешная смена пароля"}, status=status.HTTP_200_OK)
        else:
             return Response({"message": "Ошибка, пароли не совпадают"}, status=status.HTTP_400_BAD_REQUEST)
class UserPostGetView(generics.ListAPIView):
    serializer_class = DetailPostSerializer

    def get_queryset(self):
        return Posts.objects.prefetch_related(
            Prefetch('likes', queryset=Like.objects.select_related('user'))
        ).select_related('author').all()