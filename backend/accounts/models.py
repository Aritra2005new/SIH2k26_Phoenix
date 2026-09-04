from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings



class User(AbstractUser):

    class Role(models.TextChoices):
        GOVERNMENT = "GOVERNMENT", "Government"
        STARTUP = "STARTUP", "Startup"
        EVALUATOR = "EVALUATOR", "Evaluator"
        ADMIN = "ADMIN", "Admin"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STARTUP
    )

    def __str__(self):
        return f"{self.username} ({self.role})"



