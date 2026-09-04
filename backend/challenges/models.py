from django.db import models
from departments.models import GovernmentDepartment


class Challenge(models.Model):

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        CLOSED = "CLOSED", "Closed"

    department = models.ForeignKey(
        GovernmentDepartment,
        on_delete=models.CASCADE,
        related_name="challenges"
    )

    title = models.CharField(max_length=255)

    problem_statement = models.TextField()

    desired_outcome = models.TextField()

    eligibility_criteria = models.TextField(blank=True)

    required_technologies = models.TextField(blank=True)

    required_domains = models.TextField(blank=True)

    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    pilot_duration = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    # NEW
    is_engaged = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title