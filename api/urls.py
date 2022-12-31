from django.urls import path
from api.views import SurvivorView

urlpatterns = [
    path('', SurvivorView.as_view(), name='survivors'),
]
