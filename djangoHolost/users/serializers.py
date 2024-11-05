from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
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

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()