# Generated by Django 4.2.17 on 2024-12-16 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deicafe_app', '0008_alter_temporder_options_temporder_created_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='temporder',
            old_name='time',
            new_name='time_start',
        ),
        migrations.AddField(
            model_name='temporder',
            name='time_end',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
