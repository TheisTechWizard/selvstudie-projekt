from rest_framework import serializers
from .models import Annonce
from django.contrib.auth.models import User

class AnnonceSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)  # Tilføj brugernavnet
    
    class Meta:
        model = Annonce
        fields = ['id', 'title', 'content', 'price', 'created_at', 'user_username']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user