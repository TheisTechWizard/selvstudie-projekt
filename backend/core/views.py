from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from uuid import UUID
from .models import Annonce, Category, CustomUser
from .serializers import UserSerializer, AnnonceSerializer, CategorySerializer

# Brugerregistrering
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login (JWT)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(email=email, password=password)

    if user:
        token = RefreshToken.for_user(user)
        return Response({
            'access': str(token.access_token),
            'username': user.username,
            'user_id': user.id
        })
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Hent specifik bruger
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, user_id):
    try:
        user_uuid = UUID(str(user_id))  # 🛡️ Valider UUID
    except ValueError:
        return Response({'detail': 'Ugyldigt bruger-ID (ikke et gyldigt UUID).'}, status=status.HTTP_400_BAD_REQUEST)

    if request.user.id != user_uuid:
        return Response({'detail': 'Adgang nægtet.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = CustomUser.objects.get(id=user_uuid)
        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username
        })
    except CustomUser.DoesNotExist:
        return Response({'detail': 'Bruger ikke fundet.'}, status=status.HTTP_404_NOT_FOUND)

# Hent en brugers annoncer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_annoncer(request, user_id):
    try:
        user_uuid = UUID(str(user_id))  # 🛡️ Valider UUID
    except ValueError:
        return Response({'detail': 'Ugyldigt bruger-ID (ikke et gyldigt UUID).'}, status=status.HTTP_400_BAD_REQUEST)

    if request.user.id != user_uuid:
        return Response({'detail': 'Adgang nægtet.'}, status=status.HTTP_403_FORBIDDEN)

    annoncer = Annonce.objects.filter(user_id=user_uuid)
    serializer = AnnonceSerializer(annoncer, many=True)
    return Response(serializer.data)

# Alle annoncer
@api_view(['GET'])
@permission_classes([AllowAny])
def get_annoncer(request):
    search_query = request.query_params.get('search', '')
    category_id = request.query_params.get('categories', '')
    annoncer = Annonce.objects.all()

    if search_query:
        annoncer = annoncer.filter(Q(title__icontains=search_query) | Q(content__icontains=search_query))
    if category_id:
        annoncer = annoncer.filter(categories__id=category_id)

    serializer = AnnonceSerializer(annoncer, many=True)
    return Response(serializer.data)

# Opret annonce
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_annonce(request):
    serializer = AnnonceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Opdater/slet annonce
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_annoncer(request, annonce_id):
    try:
        # Valider og parse UUID
        annonce_uuid = UUID(str(annonce_id))
    except ValueError:
        return Response({'detail': 'Ugyldigt annonce-ID (ikke et gyldigt UUID).'}, status=status.HTTP_400_BAD_REQUEST)

    annonce = get_object_or_404(Annonce, id=annonce_uuid)

    # Tjek ejerskab
    if annonce.user != request.user:
        return Response(
            {'detail': 'Du har ikke tilladelse til at ændre denne annonce.'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        serializer = AnnonceSerializer(annonce)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = AnnonceSerializer(annonce, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        annonce.delete()
        return Response({'message': 'Annonce slettet!'}, status=status.HTTP_204_NO_CONTENT)

# Hent alle kategorier
@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
