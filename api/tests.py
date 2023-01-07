from rest_framework.test import APITestCase, APIClient
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

    def setUp(self):
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

        self.client.post(url, data, format='json')

    def tearDown(self):
        Survivor.objects.all().delete()

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

        response = self.client.post(url, data, format='json')
        survivor = Survivor.objects.get(pk=response.data['id'])
        inventory = Inventory.objects.get(survivor_id=survivor.id)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(survivor.name, 'Filipe Batista')
        self.assertEqual(survivor, inventory.survivor)
        self.assertFalse(survivor.is_infected)
        for item in QuantityItem.objects.filter(inventory_id=inventory.id):
            if item.item.name == 'water' or item.item.name == 'medication':
                self.assertEqual(item.quantity, 2)
            if item.item.name == 'food':
                self.assertEqual(item.quantity, 5)

    def test_report_survivor(self):
        survivor_created = Survivor.objects.get()
        self.assertFalse(survivor_created.is_infected)
        self.assertEqual(survivor_created.reports, 0)

        url = reverse("api:survivor-survivors-report",
                      args=[survivor_created.pk])
        self.client.patch(url)
        self.client.patch(url)
        response = self.client.patch(url)

        survivor_updated = Survivor.objects.get()
        self.assertTrue(survivor_updated.is_infected)
        self.assertEqual(survivor_updated.reports, 3)
        self.assertEqual(
            response.data, {'message': "Survivor has been infected. Be careful!"})

        response = self.client.patch(url)
        self.assertEqual(response.data, {
                         'message': "Survivor is already infected. Keep distance from him!"})

    def test_update_coordinates(self):
        survivor_created = Survivor.objects.get()

        url = reverse("api:survivor-detail",
                      args=[survivor_created.pk])
        data = {
            "coordinates": {
                "latitude": -5.0936,
                "longitude": -42.8358
            }
        }

        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        survivor_updated = Survivor.objects.get()

        self.assertNotEqual(survivor_created.latitude,
                            survivor_updated.latitude)
        self.assertNotEqual(survivor_created.longitude,
                            survivor_updated.longitude)

    def test_percentage_infected_and_healthy(self):
        survivor_created = Survivor.objects.get()

        url_infected = reverse("api:survivor-survivors-info-infected")
        url_healthy = reverse("api:survivor-survivors-info-healthy")

        response_infected = self.client.get(url_infected)
        self.assertEqual(response_infected.status_code, status.HTTP_200_OK)
        self.assertEqual(response_infected.data['percentage_infected'], "0%")

        response_healthy = self.client.get(url_healthy)
        self.assertEqual(response_healthy.status_code, status.HTTP_200_OK)
        self.assertEqual(response_healthy.data['percentage_healthy'], "100%")

        survivor_created.is_infected = True
        survivor_created.save()

        response_infected = self.client.get(url_infected)
        self.assertEqual(response_infected.status_code, status.HTTP_200_OK)
        self.assertEqual(response_infected.data['percentage_infected'], "100%")

        response_healthy = self.client.get(url_healthy)
        self.assertEqual(response_healthy.status_code, status.HTTP_200_OK)
        self.assertEqual(response_healthy.data['percentage_healthy'], "0%")
