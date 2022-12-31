from rest_framework import serializers
from api.models import Survivor, Inventory, Item


class SurvivorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Survivor
        fields = "__all__"


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"
