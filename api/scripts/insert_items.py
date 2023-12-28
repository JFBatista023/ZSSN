import os
import sys
from django.db import connection
from django import setup


def insert_items():
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO api_item (name, points) VALUES ('water', 4), ('food', 3), ('medicine', 2), ('ammo', 1);"
        )


if __name__ == "__main__":
    sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".."))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "zssn.settings")
    setup()

    insert_items()
