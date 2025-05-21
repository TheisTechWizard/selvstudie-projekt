from rest_framework import serializers
from .models import Annonce, Category
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class AnnonceSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    # Returner detaljerede kategoridata ved GET
    category_details = CategorySerializer(source='categories', many=True, read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    # Tillad at sende kategori-id'er ved oprettelse/redigering
    categories = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all()
    )

    class Meta:
        model = Annonce
        fields = [
            'id',
            'image',
            'title',
            'content',
            'price',
            'categories',         # ID-liste til write
            'category_details',   # Navn/id-liste til read
            'created_at',
            'user_username',
            'address'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user