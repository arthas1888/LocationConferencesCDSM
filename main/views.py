from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import GEOSGeometry, Point
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse_lazy, reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.generic import CreateView
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer, GeoModelSerializer
from rest_framework import viewsets, status
from main.connectionDb import ConexionDB
from main.forms import PointsForm
from main.models import Points, Song
from django.contrib import messages


@method_decorator(login_required, name='dispatch')
class PointsView(SuccessMessageMixin, CreateView):
    model = Points
    form_class = PointsForm
    success_url = reverse_lazy('points-create')
    success_message = "Punto creado exitosamente"
    template_name = "points-create.html"

    def form_valid(self, form):
        point = GEOSGeometry('POINT(%s %s)' % (form.cleaned_data['lon'], form.cleaned_data['lat']))
        self.object = Points.objects.create(nombre=form.cleaned_data["nombre"],
                                            direccion=form.cleaned_data["direccion"],
                                            horarios=form.cleaned_data["horarios"],
                                            celular=form.cleaned_data["celular"],
                                            telefono=form.cleaned_data["telefono"],
                                            ciudad=form.cleaned_data["ciudad"],
                                            pais=form.cleaned_data["pais"],
                                            point=point)
        success_message = self.get_success_message(form.cleaned_data)
        if success_message:
            messages.success(self.request, success_message)
        return HttpResponseRedirect(self.success_url)


class PointsSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Points
        geo_field = "point"
        fields = ('id', 'nombre', 'direccion', 'ciudad', 'pais', 'horarios', 'is_active', 'celular', 'telefono',)


class PointsViewSet(viewsets.ReadOnlyModelViewSet):
    model = Points
    queryset = Points.objects.filter(is_active=True)
    serializer_class = PointsSerializer

    @list_route(methods=['get'])
    def get_distance(self, request):
        # point/get_distance/$
        print(request.query_params.get('lat'))
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        if lat != "9999" and lon != "9999":
            query = """WITH Geocercas AS (SELECT a.*,
                        ST_Distance(ST_GeogFromText('POINT(%(lon)s %(lat)s)'), a.point) as distance_m,
                        ST_X(a.point) as lon, ST_Y(a.point) as lat
                        FROM "main_points" as a WHERE a.is_active = TRUE) SELECT * FROM Geocercas
                        ORDER BY distance_m""" \
                    % {'lat': lat, 'lon': lon}

            response = ConexionDB.custom_execute(query)
        else:
            query = """SELECT a.*,
                        ST_X(a.point) as lon, ST_Y(a.point) as lat
                        FROM "main_points" as a
                        WHERE a.is_active = TRUE
                        ORDER BY a.nombre"""
            response = ConexionDB.custom_execute(query)
            print(response)
        return Response(response, status=status.HTTP_200_OK)


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'


class SongViewSet(viewsets.ModelViewSet):
    model = Song
    queryset = Song.objects.all()
    serializer_class = SongSerializer
