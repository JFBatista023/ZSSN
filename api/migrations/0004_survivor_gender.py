# Generated by Django 4.1.4 on 2023-01-03 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_item_points'),
    ]

    operations = [
        migrations.AddField(
            model_name='survivor',
            name='gender',
            field=models.CharField(choices=[('M', 'Male'), ('F', 'Female')], default='m', max_length=1),
            preserve_default=False,
        ),
    ]
