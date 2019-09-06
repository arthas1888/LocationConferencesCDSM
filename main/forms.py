from django.contrib.gis import forms
from django.contrib.gis.forms import OSMWidget
from django.contrib.gis.geos import GEOSGeometry
from main.models import Points


class PointsForm(forms.ModelForm):
    lat = forms.DecimalField()
    lon = forms.DecimalField()

    class Meta:
        model = Points
        fields = ('nombre', 'direccion', 'ciudad', 'pais', 'horarios', 'is_active', 'celular', 'telefono',)