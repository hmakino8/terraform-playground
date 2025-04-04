# Generated by Django 4.2.17 on 2024-12-22 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deicafe_app', '0017_remove_cartitem_user_cartitem_temp_order'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reservation',
            old_name='total_price',
            new_name='total_with_tax',
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='pre_order_discount',
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='price',
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='price_at_order',
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='tax_rate',
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='total_with_tax',
        ),
        migrations.AddField(
            model_name='reservation',
            name='discount_amount',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='reservation',
            name='tax_amount',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='reservation',
            name='total',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='reservation',
            name='total_after_discount',
            field=models.IntegerField(default=0),
        ),
    ]
