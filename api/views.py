from datetime import datetime

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.views import TokenObtainPairView

from api.models import Inventory, Item, QuantityItem, Survivor
from api.serializers import (
    EmailTokenObtainPairSerializer,
    QuantityItemSerializer,
    SurvivorAuthSerializer,
    SurvivorSerializer,
)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class SurvivorRegisterViewSet(ViewSet):
    @transaction.atomic
    def create(self, request):
        """
        Create survivor.
        POST /api/v1/register/
        """
        survivor = request.data["survivor"]
        inventory_items = request.data["inventory"]["items"]

        survivor_serializer = SurvivorAuthSerializer(data=survivor)
        if survivor_serializer.is_valid():
            survivor = survivor_serializer.save()
        else:
            return Response(
                data=survivor_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        inventory_object = Inventory.objects.create(survivor=survivor)

        for item_name, item_quantity in inventory_items.items():
            if item_quantity:
                quantity_serializer = QuantityItemSerializer(
                    data={
                        "quantity": item_quantity,
                        "inventory": inventory_object.id,
                        "item": Item.objects.get(name=item_name).id,
                    }
                )
                if quantity_serializer.is_valid():
                    quantity_serializer.save()
                else:
                    Survivor.objects.get(pk=survivor.id).delete()
                    return Response(
                        data=quantity_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        return Response(status=status.HTTP_201_CREATED)


class SurvivorViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Get all survivors.
        GET /api/v1/survivors/
        """
        survivors = Survivor.objects.all()
        data = SurvivorSerializer(survivors, many=True).data
        return Response(data=data, status=status.HTTP_200_OK)

    @action(
        detail=False, methods=["GET"], url_path="healthys", url_name="survivors-healthy"
    )
    def survivors_healthy(self, request):
        """
        Get only healthy survivors.
        GET /api/v1/survivors/healthys/
        """
        survivors = Survivor.objects.filter(is_infected=False)
        data = SurvivorSerializer(survivors, many=True).data
        return Response(data=data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """
        Get a survivor.
        GET /api/v1/survivors/pk/
        """
        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            data = {}

            survivor = survivor.get()
            survivor_serializer = SurvivorSerializer(survivor)
            data["survivor"] = survivor_serializer.data

            inventory = Inventory.objects.get(survivor_id=survivor.id)
            items = QuantityItem.objects.filter(inventory_id=inventory.id)
            data["inventory"] = {"items": {}}
            data["inventory"]["items"]["total_points"] = 0
            for item in items:
                data["inventory"]["items"][item.item.name] = {
                    "quantity": item.quantity,
                    "points_per_unit": item.item.points,
                    "total_points_item": item.quantity * item.item.points,
                }
                data["inventory"]["items"]["total_points"] += (
                    item.quantity * item.item.points
                )

            return Response(data=data, status=status.HTTP_200_OK)
        return Response(
            {"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND
        )

    # Just for insert mock data
    @action(
        detail=False,
        methods=["POST"],
        url_path="create-many",
        url_name="survivors-create-many",
    )
    def create_many(self, request):
        """
        Create more than one survivor once.
        POST /api/v1/survivors/create-many/
        """
        survivors = request.data["survivors"]
        for item in survivors:
            survivor = item["survivor"]
            inventory_items = item["inventory"]["items"]

            survivor_serializer = SurvivorSerializer(data=survivor)
            if survivor_serializer.is_valid():
                survivor = survivor_serializer.save()

            inventory_object = Inventory.objects.create(survivor=survivor)

            for item_name, item_quantity in inventory_items.items():
                quantity_serializer = QuantityItemSerializer(
                    data={
                        "quantity": item_quantity,
                        "inventory": inventory_object.id,
                        "item": Item.objects.get(name=item_name).id,
                    }
                )
                if quantity_serializer.is_valid():
                    quantity_serializer.save()
                else:
                    Survivor.objects.get(pk=survivor.id).delete()
                    return Response(
                        data=quantity_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        return Response(status=status.HTTP_200_OK)

    # Just for delete mock data
    @action(
        detail=False,
        methods=["DELETE"],
        url_path="delete-all",
        url_name="survivors-delete-all",
    )
    def delete_all(self, request):
        """
        Delete all survivors.
        DELETE /api/v1/survivors/delete-all/
        """
        survivors = Survivor.objects.all()
        survivors.delete()
        return Response(status=status.HTTP_200_OK)

    @transaction.atomic
    @action(
        detail=True, methods=["PATCH"], url_path="report", url_name="survivors-report"
    )
    def report(self, request, pk=None):
        """
        Report a survivor.
        PATCH /api/v1/survivors/pk/report/
        """
        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            survivor = survivor.get()
            if survivor.reports == 3:
                return Response(
                    {
                        "message": "Survivor is already infected. Keep distance from him!"
                    },
                    status=status.HTTP_200_OK,
                )
            survivor.reports += 1
            survivor.save()
            if survivor.reports == 3:
                survivor.is_infected = True
                survivor.infected_at = datetime.now()
                survivor.save()
                return Response(
                    {"message": "Survivor has been infected. Be careful!"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"message": "Thanks for your report, we'll keep an eye on him!"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND
        )

    @action(
        detail=False,
        methods=["GET"],
        url_path="info/infected",
        url_name="survivors-info-infected",
    )
    def percentage_infected(self, request):
        """
        Get percentage of infecteds.
        GET /api/v1/survivors/info/infected/
        """
        survivors = Survivor.objects.all()
        survivors_infected = Survivor.objects.filter(is_infected=True)

        percentage_infected = (survivors_infected.count() / survivors.count()) * 100

        return Response(
            data={"percentage_infected": f"{percentage_infected:.0f}%"},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["GET"],
        url_path="info/healthy",
        url_name="survivors-info-healthy",
    )
    def percentage_healthy(self, request):
        """
        Get percentage of healthy.
        GET /api/v1/survivors/info/healthy/
        """
        survivors = Survivor.objects.all()
        survivors_healthy = Survivor.objects.filter(is_infected=False)

        percentage_healthy = (survivors_healthy.count() / survivors.count()) * 100

        return Response(
            data={"percentage_healthy": f"{percentage_healthy:.0f}%"},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["GET"],
        url_path="info/items",
        url_name="survivors-info-items",
    )
    def average_items(self, request):
        """
        Get the approximate average of items per survivor.
        GET /api/v1/survivors/info/items/
        """
        survivors_not_infected = Survivor.objects.filter(is_infected=False)

        quant_water = 0
        quant_food = 0
        quant_medication = 0
        quant_ammo = 0
        for survivor in survivors_not_infected:
            survivor_inventory = Inventory.objects.get(survivor_id=survivor.id)
            survivor_items = QuantityItem.objects.filter(
                inventory_id=survivor_inventory.id
            )

            for item in survivor_items:
                if item.item.name == "water":
                    quant_water += item.quantity
                elif item.item.name == "food":
                    quant_food += item.quantity
                elif item.item.name == "medication":
                    quant_medication += item.quantity
                else:
                    quant_ammo += item.quantity

        avg_water = quant_water / survivors_not_infected.count()
        avg_food = quant_food / survivors_not_infected.count()
        avg_medication = quant_medication / survivors_not_infected.count()
        avg_ammo = quant_ammo / survivors_not_infected.count()

        return Response(
            data={
                "averages_items": {
                    "water_per_survivor": f"{round(avg_water)}",
                    "food_per_survivor": f"{round(avg_food)}",
                    "medication_per_survivor": f"{round(avg_medication)}",
                    "ammo_per_survivor": f"{round(avg_ammo)}",
                }
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["GET"],
        url_path="info/points",
        url_name="survivors-info-points",
    )
    def points(self, request):
        """
        Get lost points and remaining points.
        GET /api/v1/survivors/info/points/
        """
        survivors_infected = Survivor.objects.filter(is_infected=True)
        survivors_not_infected = Survivor.objects.filter(is_infected=False)

        lost_points = 0
        for infected in survivors_infected:
            infected_inventory = Inventory.objects.get(survivor_id=infected.id)
            infected_items = QuantityItem.objects.filter(
                inventory_id=infected_inventory.id
            )
            lost_points += sum(
                [item.quantity * item.item.points for item in infected_items]
            )

        remaining_points = 0
        for survivor in survivors_not_infected:
            survivor_inventory = Inventory.objects.get(survivor_id=survivor.id)
            survivor_items = QuantityItem.objects.filter(
                inventory_id=survivor_inventory.id
            )
            remaining_points += sum(
                [item.quantity * item.item.points for item in survivor_items]
            )

        return Response(
            data={"lost_points": lost_points, "remaining_points": remaining_points},
            status=status.HTTP_200_OK,
        )

    @transaction.atomic
    @action(
        detail=False, methods=["POST"], url_path="trade", url_name="survivors-trade"
    )
    def trade(self, request):
        """
        Trade items between 2 healthy survivors.
        POST /api/v1/survivors/trade/
        """
        survivor1 = request.data["survivor1"]["survivor"]
        survivor2 = request.data["survivor2"]["survivor"]
        items_trade1 = request.data["items_to_trade_survivor1"]
        items_trade2 = request.data["items_to_trade_survivor2"]

        items_trade1 = {
            items_name: int(quantity)
            for items_name, quantity in items_trade1.items()
            if quantity != 0
        }
        items_trade2 = {
            items_name: int(quantity)
            for items_name, quantity in items_trade2.items()
            if quantity != 0
        }

        inventory1 = Inventory.objects.filter(survivor_id=survivor1["id"]).get()
        inventory2 = Inventory.objects.filter(survivor_id=survivor2["id"]).get()

        items1 = QuantityItem.objects.filter(inventory_id=inventory1.id)
        items2 = QuantityItem.objects.filter(inventory_id=inventory2.id)

        items_names1 = {item.item.name: item.quantity for item in items1}
        items_names2 = {item.item.name: item.quantity for item in items2}

        if not all(
            True
            if k in items_names1.keys() and items_trade1[k] <= items_names1[k]
            else False
            for k in items_trade1.keys()
        ) or not all(
            True
            if k in items_names2.keys() and items_trade2[k] <= items_names2[k]
            else False
            for k in items_trade2.keys()
        ):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        for item_name, quantity in items_trade1.items():
            for item1 in items1:
                if item1.item.name == item_name:
                    if item1.quantity - quantity == 0:
                        if item1.item.name not in items_names2.keys():
                            QuantityItem.objects.filter(
                                inventory_id=inventory1.id,
                                item_id=Item.objects.get(name=item1.item.name).pk,
                            ).update(inventory_id=inventory2.id)
                        else:
                            for item2 in items2:
                                if item2.item.name == item_name:
                                    item2.quantity += quantity
                                    item2.save()
                            item1.delete()
                    else:
                        item1.quantity -= quantity
                        item1.save()
                        if item1.item.name not in items_names2.keys():
                            QuantityItem.objects.create(
                                quantity=quantity,
                                inventory_id=inventory2.id,
                                item_id=Item.objects.get(name=item1.item.name).pk,
                            )
                        else:
                            for item2 in items2:
                                if item2.item.name == item_name:
                                    item2.quantity += quantity
                                    item2.save()

        for item_name, quantity in items_trade2.items():
            for item2 in items2:
                if item2.item.name == item_name:
                    if item2.quantity - quantity == 0:
                        if item2.item.name not in items_names1.keys():
                            QuantityItem.objects.filter(
                                inventory_id=inventory2.id,
                                item_id=Item.objects.get(name=item2.item.name).pk,
                            ).update(inventory_id=inventory1.id)
                        else:
                            for item1 in items1:
                                if item1.item.name == item_name:
                                    item1.quantity += quantity
                                    item1.save()
                            item2.delete()
                    else:
                        item2.quantity -= quantity
                        item2.save()
                        if item2.item.name not in items_names1.keys():
                            QuantityItem.objects.create(
                                quantity=quantity,
                                inventory_id=inventory1.id,
                                item_id=Item.objects.get(name=item2.item.name).pk,
                            )
                        else:
                            for item1 in items1:
                                if item1.item.name == item_name:
                                    item1.quantity += quantity
                                    item1.save()

        return Response(status=status.HTTP_200_OK)

    @transaction.atomic
    def partial_update(self, request, pk=None):
        """
        Update survivor coordinates.
        PATCH /api/v1/survivors/
        """
        coordinates = request.data["coordinates"]

        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            survivor = survivor.get()
            survivor.latitude = coordinates["latitude"]
            survivor.longitude = coordinates["longitude"]
            survivor.save()

            data = SurvivorSerializer(survivor).data
            return Response(data=data, status=status.HTTP_200_OK)
        return Response(
            {"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND
        )

    @transaction.atomic
    def destroy(self, request, pk=None):
        """
        Delete a survivor.
        DELETE /api/v1/survivors/pk/
        """
        survivor = Survivor.objects.filter(pk=pk)
        if survivor.exists():
            survivor = survivor.get()
            survivor.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(
            {"message": "No survivors found."}, status=status.HTTP_404_NOT_FOUND
        )
