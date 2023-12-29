from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from api.models import Survivor, Inventory, Item, QuantityItem
from django.contrib.auth import authenticate
from rest_framework import exceptions


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            survivor = authenticate(email=email, password=password)

            if survivor:
                if survivor.is_infected:
                    raise exceptions.AuthenticationFailed("Survivor is infected.")

                refresh = self.get_token(survivor)

                data = {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }

                return data
            else:
                raise exceptions.AuthenticationFailed("Invalid email or password.")
        else:
            raise exceptions.AuthenticationFailed("Email and password are required.")

    @classmethod
    def get_token(cls, survivor):
        token = super().get_token(survivor)

        token["name"] = survivor.name

        return token


class SurvivorAuthSerializer(serializers.ModelSerializer):
    def validate_email(self, value):
        if value and not value.endswith("@zssn.com"):
            raise serializers.ValidationError(
                "The email should be from the domain '@zssn.com'."
            )
        return value

    def validate_password(self, password):
        return make_password(password)

    class Meta:
        model = Survivor
        fields = "__all__"


class SurvivorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Survivor
        exclude = ["email", "password"]


class QuantityItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source="item.name")

    class Meta:
        model = QuantityItem
        fields = "__all__"
        extra_fields = ["item_name"]

    def get_field_names(self, declared_fields, info):
        expanded_fields = super(QuantityItemSerializer, self).get_field_names(
            declared_fields, info
        )

        if getattr(self.Meta, "extra_fields", None):
            return expanded_fields + self.Meta.extra_fields
        else:
            return expanded_fields


class InventorySerializer(serializers.ModelSerializer):
    quantity = QuantityItemSerializer(source="quantityitem_set", many=True)

    class Meta:
        model = Inventory
        fields = ["id", "items", "quantity"]


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"
