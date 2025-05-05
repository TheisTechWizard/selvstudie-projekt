from django.contrib import admin
from .models import Annonce  # Importér din model
from .models import Category

admin.site.register(Annonce)
admin.site.register(Category)