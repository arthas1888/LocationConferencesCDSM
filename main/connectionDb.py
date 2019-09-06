# coding=utf-8
import psycopg2
import psycopg2.extras
from locationMarker.settings import DATABASES


class ConexionDB:
    @staticmethod
    def custom_execute(queryset, params=None):
        query_result = {}
        conexion = DATABASES['default']
        DSN = "dbname='{0}' user='{1}' host='{2}' password='{3}' port='{4}'".format(
            conexion['NAME'],
            conexion['USER'],
            conexion['HOST'],
            conexion['PASSWORD'],
            conexion['PORT']
        )
        conn = psycopg2.connect(DSN)
        # cursor = conn.cursor()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            cursor.execute(queryset, params)
            query_result = cursor.fetchall()

        except Exception as e:
            conn.rollback()
            print("Unable to connect to the database, Error", e)
        cursor.close()
        conn.close()
        return query_result