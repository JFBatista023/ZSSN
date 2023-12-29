from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import update_last_login
from rest_framework import status
from rest_framework.response import Response
from api.models import Survivor


class EmailBackend(ModelBackend):
    def authenticate(self, request, email, password):
        try:
            survivor = Survivor.objects.get(email=email)
            if survivor.check_password(password):
                update_last_login(None, survivor)
                return survivor
        except Survivor.DoesNotExist:
            return Response("Survivor not registered", status=status.HTTP_404_NOT_FOUND)
