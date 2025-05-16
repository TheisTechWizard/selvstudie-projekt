from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_annoncer, register, create_annonce, manage_annoncer, get_categories

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('annoncer/', get_annoncer, name='get_annoncer'),
    path('annoncer/create/', create_annonce, name='create_annonce'),
    path('annoncer/<int:annonce_id>/', manage_annoncer, name='manage_annoncer'),  # Rediger og slet
    path('categories/', get_categories, name='get_categories'),
]
