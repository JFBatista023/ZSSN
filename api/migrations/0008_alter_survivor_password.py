# Generated by Django 5.0 on 2023-12-28 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_survivor_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='survivor',
            name='password',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]