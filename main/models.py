from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class Points(models.Model):
    nombre = models.CharField(max_length=50, unique=True, db_index=True)
    direccion = models.TextField()
    horarios = models.TextField(null=True, blank=True)
    celular = models.BigIntegerField(null=True, blank=True)
    telefono = models.BigIntegerField(null=True, blank=True)
    ciudad = models.CharField(max_length=50, null=True, blank=True)
    pais = models.CharField(max_length=50, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    point = models.PointField()

    def __str__(self):
        return self.nombre


class Song(models.Model):
    nombre = models.CharField(max_length=150, unique=True, db_index=True)
    autor = models.CharField(max_length=50)
    album = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre