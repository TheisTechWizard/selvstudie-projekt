from rest_framework import serializers
from .models import Annonce, Category, CustomUser, SavedSearch


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class AnnonceSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.CharField(source='user.id', read_only=True) 
    category_details = CategorySerializer(source='categories', many=True, read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
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
            'categories',
            'category_details',
            'created_at',
            'user_username',
            'user_id',
            'address'
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    

class SavedSearchSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='categories', many=True, read_only=True)

    class Meta:
        model = SavedSearch
        fields = [
            'id',
            'keyword',
            'max_price',
            'categories',
            'category_details'
        ]
