from rest_framework import serializers
from api.models import Survivor, Inventory, Item, QuantityItem


class SurvivorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Survivor
        fields = "__all__"


class QuantityItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')

    class Meta:
        model = QuantityItem
        fields = "__all__"
        extra_fields = ['item_name']

    def get_field_names(self, declared_fields, info):
        expanded_fields = super(QuantityItemSerializer,
                                self).get_field_names(declared_fields, info)

        if getattr(self.Meta, 'extra_fields', None):
            return expanded_fields + self.Meta.extra_fields
        else:
            return expanded_fields


class InventorySerializer(serializers.ModelSerializer):
    quantity = QuantityItemSerializer(source='quantityitem_set', many=True)

    class Meta:
        model = Inventory
        fields = ["id", "items", "quantity"]


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"
