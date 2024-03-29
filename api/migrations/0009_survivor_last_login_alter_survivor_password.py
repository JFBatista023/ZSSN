# Generated by Django 5.0 on 2023-12-29 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_survivor_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='survivor',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, verbose_name='last login'),
        ),
        migrations.AlterField(
            model_name='survivor',
            name='password',
            field=models.CharField(max_length=128, verbose_name='password'),
        ),
    ]
