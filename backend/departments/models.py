from django.conf import settings
from django.db import models


class GovernmentDepartment(models.Model):

    name = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    contact_email = models.EmailField(blank=True)

    contact_phone = models.CharField(
        max_length=20,
        blank=True
    )

    location = models.CharField(
        max_length=200,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name