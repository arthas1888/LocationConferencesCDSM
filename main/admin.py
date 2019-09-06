from django.contrib import admin
from django.contrib.gis.admin import OSMGeoAdmin
from main.models import Points, Song
from django.contrib.admin.models import DELETION
from django.utils.html import escape
from django.urls import reverse


class PointsModelAdmin(OSMGeoAdmin):
    def __init__(self, *args):
        super().__init__(*args)
        self.default_lon = -8246253
        self.default_lat = 520540
        self.default_zoom = 12
        self.map_width = 1000
        self.map_height = 600

    list_filter = [
        'nombre',
        'direccion',
        'ciudad',
        'pais',
        'is_active',
    ]

    search_fields = [
        'nombre',
    ]

    list_display = [
        'pk',
        'nombre',
        'direccion',
        'ciudad',
        'pais',
        'is_active',
    ]


class SongModelAdmin(admin.ModelAdmin):

    list_filter = [
        'nombre',
        'autor',
        'album',
    ]

    search_fields = [
        'nombre',
    ]

    list_display = [
        'pk',
        'nombre',
        'autor',
        'album'
    ]

    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def object_link(self, obj):
        if obj.action_flag == DELETION:
            link = escape(obj.object_repr)
        else:
            ct = obj.content_type
            link = u'<a href="%s">%s</a>' % (
                reverse('admin:%s_%s_change' % (ct.app_label, ct.model), args=[obj.object_id]),
                escape(obj.object_repr),
            )
        return link
    object_link.allow_tags = True
    object_link.admin_order_field = 'id'
    object_link.short_description = u'object'


admin.site.register(Points, PointsModelAdmin)
admin.site.register(Song, SongModelAdmin)
