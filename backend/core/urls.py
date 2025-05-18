from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    get_annoncer,
    register,
    create_annonce,
    manage_annoncer,
    get_categories,
    login,  # ← tilføj din egen login-funktion
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),  # ← brug din egen login-view her
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('annoncer/', get_annoncer, name='get_annoncer'),
    path('annoncer/create/', create_annonce, name='create_annonce'),
    path('annoncer/<int:annonce_id>/', manage_annoncer, name='manage_annoncer'),
    path('categories/', get_categories, name='get_categories'),
]