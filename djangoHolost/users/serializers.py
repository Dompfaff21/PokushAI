from rest_framework import serializers

from recipe.models import Posts, Like
from .models import Profile
from django.contrib.auth.models import User


class UserDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    phone = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'phone')

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Пароли не совпадают")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password1'],
            email=validated_data['email']
        )

        Profile.objects.create(
            user=user,
            phone=validated_data['phone']
        )
        return user

class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'password')


class ListUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')


class DetailProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', required=False)
    image = serializers.ImageField(source='profile.image', required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'image')
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False}
        }

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        user = super().update(instance, validated_data)

        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return user

class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('__all__')

class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('image')

class DetailPostSerializer(serializers.ModelSerializer):
    image = UserImageSerializer(source='image')
    likes = LikesSerializer(source='likes')
    class Meta:
        model = Posts
        fields = ('__all__', 'image', 'likes')