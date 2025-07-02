import os

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer
from .models import Profile
from recipe.models import Posts




class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Пользователь успешно зарегистрирован",
                "userId": user.id
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        
class LoginView(APIView):
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

class UserProfileView(APIView):
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            profile = Profile.objects.get(user=user.id)
            if profile.image:
                image_url = request.build_absolute_uri(profile.image.url)
                return Response({
                    "username": user.username,
                    "userId": user.id,
                    "userImage": image_url
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "username": user.username,
                    "userId": user.id,
                }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)


class UserProfileUpdatePicsView(APIView):
    def post(self, request):
        user = User.objects.get(id=request.POST.get('userId'))
        profile = Profile.objects.get(user=user.id)
        if request.FILES:
            old_image_path = None
            if profile.image:
                old_image_path = profile.image.path
            new_image = request.FILES.get('image')
            if new_image:
                profile.image = new_image
            profile.save()
            if new_image and old_image_path and os.path.exists(old_image_path):
                os.remove(old_image_path)
            return Response({"message": "Смена фото успешна"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Ошибка данных"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileDeleteImageView(APIView):
    def delete(self, request, id):      #request не удалять, без него метод не работает, потому что Кирилл его добавил у себя в мобилке, зачем то
        user = User.objects.get(id=id)
        profile = Profile.objects.get(user=user)
        if profile.image:
            image_path = profile.image.path
            if os.path.exists(image_path):
                os.remove(image_path)
        profile.image.delete()
        profile.image = None
        profile.save()
        return Response(status=status.HTTP_200_OK)

class UserProfileUpdateView(APIView):
    def post(self, request):
        user = User.objects.get(id=request.data.get('userId'))
        profile = Profile.objects.get(user=user)
        if profile:
            user.username = request.data.get('username')
            user.email = request.data.get('email')
            profile.phone = request.data.get('phone')
            user.save()
            profile.save()
            return Response(
                {"message": "Смена данных успешна"},
                status=status.HTTP_200_OK)
        else:
            return Response({"message": "Ошибка"}, status=status.HTTP_404_NOT_FOUND)
        
class UserUpdatePasswordView(APIView):
    def post(self, request):
        user =  User.objects.get(id=request.data.get('userId'))
        if user.check_password(request.data.get('oldPassword')):
            user.set_password(request.data.get('password'))
            user.save()
            return Response({"message": "Успешная смена пароля"}, status=status.HTTP_200_OK)
        else:
             return Response({"message": "Ошибка, пароли не совпадают"}, status=status.HTTP_400_BAD_REQUEST) 

class UsersPostsGetView(APIView):
    def get(self, request):
        data = []
        user_data = []

        post = Posts.objects.all().order_by('-created_at')

        for item in post:
            data.append({
                    "author": item.author.username,
                    "title": item.title,
                    "des": item.description,
                    "image": request.build_absolute_uri(item.post_image.url) if item.post_image else None,
                    "created_at": item.created_at,
                    "update_at": item.update_at,
                    "views": item.views,
                    "likes": item.likes.count()
                })
        profiles = Profile.objects.all()

        for item in profiles:
            if item.image:
                user_data.append(
                    {
                        "user_image": request.build_absolute_uri(item.image)
                    }
                )

        return Response({
            "data": data,
            "user_data": user_data
        }, status=status.HTTP_200_OK)