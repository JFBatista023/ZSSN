from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Survivor, Inventory, QuantityItem, Item


class SurvivorTests(APITestCase):
    def test_create_new_survivor(self):
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

        print(url)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Survivor.objects.count(), 1)
        self.assertEqual(Survivor.objects.get().name, 'Filipe Batista')
        self.assertFalse(Survivor.objects.get().is_infected)
        for item in QuantityItem.objects.all():
            self.assertEqual(item.quantity, 2)
            self.assertEqual(item.quantity, 5)
            self.assertEqual(item.quantity, 2)

        Survivor.objects.all().delete()
