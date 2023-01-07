from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Survivor, Inventory, QuantityItem, Item


class SurvivorTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.water = Item.objects.create(name='water', points='4')
        cls.food = Item.objects.create(name='food', points='3')
        cls.medication = Item.objects.create(
            name='medication', points='2')
        cls.ammo = Item.objects.create(name='ammo', points='1')

    def test_create_new_survivor(self):
        Survivor.objects.all().delete()
        url = reverse("api:survivor-list")
        data = {
            "survivor": {
                "name": "Filipe Batista",
                "age": 20,
                "gender": "M",
                "latitude": -5.0879,
                "longitude": -42.8009,
                "birth_date": "2002-08-17"
            },
            "inventory": {
                "items": {
                    "water": 2,
                    "food": 5,
                    "medication": 2
                }
            }
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Survivor.objects.count(), 1)
        self.assertEqual(Survivor.objects.get().name, 'Filipe Batista')
        self.assertEqual(Survivor.objects.get(),
                         Inventory.objects.get().survivor)
        self.assertFalse(Survivor.objects.get().is_infected)
        for item in QuantityItem.objects.all():
            if item.item.name == 'water' or item.item.name == 'medication':
                self.assertEqual(item.quantity, 2)
            if item.item.name == 'food':
                self.assertEqual(item.quantity, 5)
