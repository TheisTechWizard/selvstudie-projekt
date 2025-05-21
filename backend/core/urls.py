from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    get_annoncer,
    register,
    create_annonce,
    manage_annoncer,
    get_categories,
    login, 
    get_user, 
    get_user_annoncer,
    get_coords,
    google_maps_loader
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('annoncer/', get_annoncer, name='get_annoncer'),
    path('annoncer/create/', create_annonce, name='create_annonce'),
    path('annoncer/<uuid:annonce_id>/', manage_annoncer, name='manage_annoncer'), 
    path('categories/', get_categories, name='get_categories'),
    path('users/<uuid:user_id>/', get_user, name='get_user'),                      
    path("users/<uuid:user_id>/annoncer/", get_user_annoncer, name='get_user_annoncer'), 
]
