from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Annonce(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    price = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    categories = models.ManyToManyField(Category, related_name="annoncer")

    class Meta:
        verbose_name = "Annonce"
        verbose_name_plural = "Annoncer"

    def __str__(self):
        return f"{self.title} ({self.price})"
