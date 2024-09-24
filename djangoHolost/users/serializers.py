from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('username', 'phone', 'email', 'password1', 'password2')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password1'],
            email=validated_data['email']
        )
        user_for_Profile = Profile.objects.create(
            user=validated_data['username'],
            phone=validated_data['phone']
        )
        return user, user_for_Profile
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()