from django.contrib.auth.backends import ModelBackend
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from api.models import Survivor


class EmailBackend(ModelBackend):
    def authenticate(self, request, email, password):
        try:
            survivor = Survivor.objects.get(email=email)
            if check_password(password, survivor.password):
                return survivor
        except Survivor.DoesNotExist:
            return Response("Survivor not registered", status=status.HTTP_404_NOT_FOUND)
