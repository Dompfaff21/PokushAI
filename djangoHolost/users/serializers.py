from rest_framework import serializers
from .models import Profile

class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile  # Ссылка на модель
        fields = '__all__'