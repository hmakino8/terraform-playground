# Generated by Django 4.2.17 on 2024-12-20 02:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('deicafe_app', '0011_rename_pre_order_discount_cartitem_discount_rate'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reservation',
            old_name='seat_id',
            new_name='seat_number',
        ),
    ]
