# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-01-22 23:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_song'),
    ]

    operations = [
        migrations.AddField(
            model_name='points',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
