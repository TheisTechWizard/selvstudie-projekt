from rest_framework import serializers
from .models import Annonce, Category
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class AnnonceSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)  # Tilføj brugernavnet
    categories = CategorySerializer(many=True, read_only=True)
    class Meta:
        model = Annonce
        fields = ['id', 'title', 'content', 'price', 'categories', 'created_at', 'user_username']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user