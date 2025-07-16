from django.db.models import Prefetch
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from djangoHolost.permissions import *
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from .serializers import *
from .models import Profile
from recipe.models import Posts


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserDetailSerializer


class ListUserView(generics.ListAPIView):
    serializer_class = ListUsersSerializer
    queryset = User.objects.all()


class LoginUserView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )

        if not user:
            return Response(
                {"error": "Неверное имя пользователя или пароль"},
                status=status.HTTP_400_BAD_REQUEST
            )

        login(request, user)
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "message": "Вход выполнен успешно",
            "userId": user.id
        }, status=status.HTTP_200_OK)


class UserGetProfileView(generics.RetrieveAPIView):
    serializer_class = DetailProfileSerializer
    queryset = User.objects.all()


class UserProfileDeleteImageView(generics.DestroyAPIView):
    queryset = Profile.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsOwnerOrReadOnly, )

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
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsOwnerOrReadOnly,)

    def get_object(self):
        return self.request.user 


class UserUpdatePasswordView(generics.UpdateAPIView):
    serializer_class = UserUpdatePasswordSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        return self.request.user


class UserPostGetView(generics.ListAPIView):
    serializer_class = DetailPostSerializer

    def get_queryset(self):
        return Posts.objects.prefetch_related(
            Prefetch('likes', queryset=Like.objects.select_related('user'))
        ).select_related('author').all()
