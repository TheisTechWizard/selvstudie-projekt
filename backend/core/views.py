from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, AnnonceSerializer, CategorySerializer
from .models import Annonce, Category
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db.models import Q

# Brugerregistrering
@api_view(['POST'])
@permission_classes([AllowAny])  # Tillad alle at registrere sig
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login for at få JWT-token og brugernavn
@api_view(['POST'])
@permission_classes([AllowAny])  # Alle kan logge ind
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)  # Verificer bruger
    if user:
        # Generer JWT-token
        token = RefreshToken.for_user(user)
        return Response({
            'access': str(token.access_token),  # Returner access token
            'username': user.username  # Returner brugernavnet
        })
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# Vis annoncer for alle (offentlig adgang)
@api_view(['GET'])
@permission_classes([AllowAny])  
def get_annoncer(request):
    search_query = request.query_params.get('search', '')
    category_id = request.query_params.get('categories', '')

    annoncer = Annonce.objects.all()

    # Søg på titel & content
    if search_query:
        annoncer = annoncer.filter(Q(title__icontains=search_query) | Q(content__icontains=search_query))

    # Filtrér på kategori
    if category_id:
        annoncer = annoncer.filter(categories__id=category_id)

    serializer = AnnonceSerializer(annoncer, many=True)
    return Response(serializer.data)

# Opret annonce (POST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Kun for loggede ind brugere
def create_annonce(request):
    serializer = AnnonceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)  # Tilføj brugeren fra JWT-token
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Opdater og slet annonce (kun ejer kan gøre dette)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_annoncer(request, annonce_id):
    annonce = get_object_or_404(Annonce, id=annonce_id)

    # Handle GET request (return annonce details) - no ownership check needed
    if request.method == 'GET':
        serializer = AnnonceSerializer(annonce)
        return Response(serializer.data)

    # Check if the user owns the annonce (for PUT and DELETE requests)
    if annonce.user != request.user:
        return Response({'detail': 'Du har ikke tilladelse til at ændre denne annonce'}, status=status.HTTP_403_FORBIDDEN)

    # Handle PUT request (update annonce)
    if request.method == 'PUT':
        serializer = AnnonceSerializer(annonce, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle DELETE request (delete annonce)
    if request.method == 'DELETE':
        annonce.delete()
        return Response({'message': 'Annonce slettet!'}, status=status.HTTP_204_NO_CONTENT)

# Hent kategorier
@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)