from django.db import models


class Survivor(models.Model):
    name = models.CharField(max_length=200)
    age = models.IntegerField()
    is_infected = models.BooleanField(default=False, blank=True)
    reports = models.IntegerField(default=0, blank=True)
    latitude = models.DecimalField(max_digits=6, decimal_places=4)
    longitude = models.DecimalField(max_digits=6, decimal_places=4)
    birth_date = models.DateField()
    registered_at = models.DateTimeField(auto_now_add=True)
    infected_at = models.DateTimeField(blank=True, null=True)


class Item(models.Model):
    name = models.CharField(max_length=100)
    points = models.IntegerField()


class Inventory(models.Model):
    survivor = models.OneToOneField(
        Survivor, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item)
