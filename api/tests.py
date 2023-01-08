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

    def test_average_items(self):
        url = reverse('api:survivor-survivors-info-items')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            int(response.data['averages_items']['water_per_survivor']), 2)
        self.assertEqual(
            int(response.data['averages_items']['food_per_survivor']), 5)
        self.assertEqual(
            int(response.data['averages_items']['medication_per_survivor']), 2)
        self.assertEqual(
            int(response.data['averages_items']['ammo_per_survivor']), 0)

    def test_points(self):
        survivor_created = Survivor.objects.get()
        url = reverse('api:survivor-survivors-info-points')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            int(response.data['lost_points']), 0)
        self.assertEqual(
            int(response.data['remaining_points']), 27)

        survivor_created.is_infected = True
        survivor_created.save()

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            int(response.data['lost_points']), 27)
        self.assertEqual(
            int(response.data['remaining_points']), 0)

    def test_trade(self):
        Survivor.objects.all().delete()
        url = reverse('api:survivor-survivors-create-many')
        data = {
            "survivors": [
                {
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
                            "medication": 3,
                            "food": 2
                        }
                    }
                },
                {
                    "survivor": {
                        "name": "João Silva",
                        "age": 22,
                        "gender": "M",
                                "latitude": -54.0879,
                                "longitude": -12.8009,
                                "birth_date": "2000-09-27"
                    },
                    "inventory": {
                        "items": {
                            "water": 3,
                            "medication": 4,
                            "ammo": 4
                        }
                    }
                }
            ]
        }

        self.client.post(url, data, format='json')

        url = reverse('api:survivor-survivors-trade')
        data = {
            "survivor1": {
                "survivor": {
                    "id": Survivor.objects.get(name='Filipe Batista').pk,
                    "name": "Filipe Batista",
                    "age": 20,
                    "gender": "M",
                    "is_infected": 'false',
                    "reports": 0,
                    "latitude": "-5.0879",
                    "longitude": "-42.8009",
                    "birth_date": "2002-08-17",
                    "registered_at": "2023-01-07T12:05:26.001866",
                    "infected_at": 'null'
                }
            },
            "survivor2": {
                "survivor": {
                    "id": Survivor.objects.get(name='João Silva').pk,
                    "name": "João Silva",
                    "age": 22,
                    "gender": "M",
                    "is_infected": 'false',
                    "reports": 0,
                    "latitude": "-54.0879",
                    "longitude": "-12.8009",
                    "birth_date": "2000-09-27",
                    "registered_at": "2023-01-07T12:05:26.035648",
                    "infected_at": 'null'
                }
            },
            "items_to_trade_survivor1": {
                "water": 1,
                "food": 2,
                "medication": 0,
                "ammo": 0
            },
            "items_to_trade_survivor2": {
                "water": 0,
                "food": 0,
                "medication": 3,
                "ammo": 4
            }
        }

        items_before_1 = QuantityItem.objects.filter(inventory_id=Inventory.objects.get(
            survivor_id=Survivor.objects.get(name='Filipe Batista').pk))
        items_before_2 = QuantityItem.objects.filter(inventory_id=Inventory.objects.get(
            survivor_id=Survivor.objects.get(name='João Silva').pk))

        items_1 = {item.item.name: item.quantity for item in items_before_1}
        items_2 = {item.item.name: item.quantity for item in items_before_2}

        self.assertTrue('food' in items_1.keys())
        self.assertTrue('ammo' in items_2.keys())

        self.assertFalse('ammo' in items_1.keys())
        self.assertFalse('food' in items_2.keys())

        for item_name, item_quantity in items_1.items():
            if item_name == 'water':
                self.assertEqual(item_quantity, 2)
            if item_name == 'medication':
                self.assertEqual(item_quantity, 3)
            if item_name == 'food':
                self.assertEqual(item_quantity, 2)

        for item_name, item_quantity in items_2.items():
            if item_name == 'water':
                self.assertEqual(item_quantity, 3)
            if item_name == 'medication':
                self.assertEqual(item_quantity, 4)
            if item_name == 'ammo':
                self.assertEqual(item_quantity, 4)

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        items_after_1 = QuantityItem.objects.filter(inventory_id=Inventory.objects.get(
            survivor_id=Survivor.objects.get(name='Filipe Batista').pk))
        items_after_2 = QuantityItem.objects.filter(inventory_id=Inventory.objects.get(
            survivor_id=Survivor.objects.get(name='João Silva').pk))

        items_1 = {item.item.name: item.quantity for item in items_after_1}
        items_2 = {item.item.name: item.quantity for item in items_after_2}

        self.assertFalse('food' in items_1.keys())
        self.assertFalse('ammo' in items_2.keys())

        self.assertTrue('ammo' in items_1.keys())
        self.assertTrue('food' in items_2.keys())

        for item_name, item_quantity in items_1.items():
            if item_name == 'water':
                self.assertEqual(item_quantity, 1)
            if item_name == 'medication':
                self.assertEqual(item_quantity, 6)
            if item_name == 'ammo':
                self.assertEqual(item_quantity, 4)

        for item_name, item_quantity in items_2.items():
            if item_name == 'water':
                self.assertEqual(item_quantity, 4)
            if item_name == 'medication':
                self.assertEqual(item_quantity, 1)
            if item_name == 'food':
                self.assertEqual(item_quantity, 2)
