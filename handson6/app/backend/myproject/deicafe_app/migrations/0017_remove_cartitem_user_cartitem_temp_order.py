# Generated by Django 4.2.17 on 2024-12-22 12:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('deicafe_app', '0016_orderitem_price_orderitem_total_with_tax'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cartitem',
            name='user',
        ),
        migrations.AddField(
            model_name='cartitem',
            name='temp_order',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='deicafe_app.temporder'),
        ),
    ]
