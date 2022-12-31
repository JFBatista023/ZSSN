from datetime import datetime
from django.db.models import Sum
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from api.models import Survivor, Inventory, Item
from api.serializers import SurvivorSerializer, InventorySerializer


class SurvivorViewSet(ViewSet):

    def list(self, request):
        survivors = Survivor.objects.all()
        data = SurvivorSerializer(survivors).data
        return Response(data=data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            survivor = survivor.get()
            survivor_serializer = SurvivorSerializer(survivor)
            return Response(data=survivor_serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        survivor = request.data['survivor']
        inventory_items = request.data['inventory']['items']

        survivor_serializer = SurvivorSerializer(data=survivor)
        if survivor_serializer.is_valid():
            survivor = survivor_serializer.save()
        else:
            return Response(data=survivor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        inventory = {}
        inventory['survivor'] = survivor.id
        inventory['items'] = [Item.objects.get(
            name=item).id for item in inventory_items]
        inventory_serializer = InventorySerializer(data=inventory)
        if inventory_serializer.is_valid():
            inventory_serializer.save()
            return Response(data=survivor_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=inventory_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['PATCH'], url_path='report', url_name='survivors-report')
    def report(self, request, pk=None):
        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            survivor = survivor.get()
            if survivor.reports == 3:
                return Response({'message': "Survivor is already infected. Keep distance from him!"}, status=status.HTTP_200_OK)
            survivor.reports += 1
            survivor.save()
            if survivor.reports == 3:
                survivor.is_infected = True
                survivor.infected_at = datetime.now()
                survivor.save()
                return Response({'message': "Survivor has been infected. Be careful!"}, status=status.HTTP_200_OK)
            return Response({'message': "Thanks for your report, we'll keep an eye on him!"}, status=status.HTTP_200_OK)
        return Response({"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'], url_path='info/infected', url_name='survivors-info-infected')
    def percentage_infected(self, request):
        survivors = Survivor.objects.all()
        survivors_infected = Survivor.objects.filter(is_infected=True)

        percentage_infected = (
            survivors_infected.count() / survivors.count()) * 100

        return Response(data={"percentage_infected": f"{percentage_infected:.0f}%"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], url_path='info/healthy', url_name='survivors-info-healthy')
    def percentage_not_infected(self, request):
        survivors = Survivor.objects.all()
        survivors_not_infected = Survivor.objects.filter(is_infected=False)

        percentage_not_infected = (
            survivors_not_infected.count() / survivors.count()) * 100

        return Response(data={"percentage_not_infected": f"{percentage_not_infected:.0f}%"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], url_path='info/items', url_name='survivors-info-items')
    def average_items(self, request):
        survivors_not_infected = Survivor.objects.filter(is_infected=False)

        quant_water = 0
        quant_food = 0
        quant_medication = 0
        quant_ammo = 0
        for survivor in survivors_not_infected:
            survivor_inventory = Inventory.objects.get(survivor_id=survivor.id)
            survivor_items = survivor_inventory.items.all()

            quant_water += survivor_items.filter(name='water').count()
            quant_food += survivor_items.filter(name='food').count()
            quant_medication += survivor_items.filter(
                name='medication').count()
            quant_ammo += survivor_items.filter(name='ammo').count()

        avg_water = quant_water // survivors_not_infected.count()
        avg_food = quant_food // survivors_not_infected.count()
        avg_medication = quant_medication // survivors_not_infected.count()
        avg_ammo = quant_ammo // survivors_not_infected.count()

        return Response(data={"averages_items": {
            "water_per_survivor": avg_water,
            "food_per_survivor": avg_food,
            "medication_per_survivor": avg_medication,
            "ammo_per_survivor": avg_ammo,
        }}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], url_path='info/points', url_name='survivors-info-points')
    def points(self, request):
        survivors_infected = Survivor.objects.filter(is_infected=True)
        survivors_not_infected = Survivor.objects.filter(is_infected=False)

        lost_points = 0
        for infected in survivors_infected:
            infected_inventory = Inventory.objects.get(survivor_id=infected.id)
            infected_items = infected_inventory.items.all()
            lost_points += infected_items.aggregate(Sum('points'))[
                'points__sum']

        remaining_points = 0
        for survivor in survivors_not_infected:
            survivor_inventory = Inventory.objects.get(survivor_id=survivor.id)
            survivor_items = survivor_inventory.items.all()
            remaining_points += survivor_items.aggregate(Sum('points'))[
                'points__sum']

        return Response(data={"lost_points": lost_points, "remaining_points": remaining_points}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        coordinates = request.data['coordinates']

        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            survivor = survivor.get()
            survivor.latitude = coordinates['latitude']
            survivor.longitude = coordinates['longitude']
            survivor.save()

            data = SurvivorSerializer(survivor).data
            return Response(data=data, status=status.HTTP_200_OK)
        return Response({"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            survivor = survivor.get()
            survivor.delete()
            return Response(status=status.HTTP_200_OK)
        return Response({"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND)
