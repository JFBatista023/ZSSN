from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from api.models import Survivor, Item
from api.serializers import SurvivorSerializer, InventorySerializer


class SurvivorView(ViewSet):
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

    def destroy(self, request, pk):
        survivor = Survivor.objects.get(pk=pk)

        if survivor:
            survivor.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
