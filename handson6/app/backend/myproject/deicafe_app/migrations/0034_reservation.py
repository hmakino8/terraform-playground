# Generated by Django 4.2.17 on 2025-01-22 12:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('deicafe_app', '0033_cart'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_takein', models.BooleanField(default=False)),
                ('is_pre_order', models.BooleanField(default=False)),
                ('reservation_date', models.DateField()),
                ('reservation_time_start', models.TimeField()),
                ('reservation_time_end', models.TimeField()),
                ('seat', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('cart_items', models.ManyToManyField(to='deicafe_app.cart')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
