# Generated by Django 4.2.17 on 2025-01-21 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deicafe_app', '0028_remove_orderitem_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='size',
            field=models.CharField(choices=[('S', 'Small'), ('M', 'Medium'), ('L', 'Large')], default='S', max_length=1),
        ),
    ]
