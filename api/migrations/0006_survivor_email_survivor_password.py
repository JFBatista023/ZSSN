# Generated by Django 5.0 on 2023-12-28 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_quantityitem_alter_inventory_items'),
    ]

    operations = [
        migrations.AddField(
            model_name='survivor',
            name='email',
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='survivor',
            name='password',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]
