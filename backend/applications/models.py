from django.db import models
from django.conf import settings

from startups.models import Startup
from challenges.models import Challenge


class Application(models.Model):

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        SUBMITTED = "SUBMITTED", "Submitted"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        REJECTED = "REJECTED", "Rejected"
        APPROVED = "APPROVED", "Approved"
        CANCELLED = "CANCELLED", "Cancelled"

        PENDING_ACCEPTANCE = (
            "PENDING_ACCEPTANCE",
            "Pending Acceptance"
        )

        ACCEPTED = "ACCEPTED", "Accepted"

        COMPLETED = "COMPLETED", "Completed"

    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    # government = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.CASCADE,
    #     related_name="applications_created",
    #     null=True,
    #     blank=True
    # )

    government = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
            related_name="government_applications",
            null=True,
            blank=True
        )

    proposal_title = models.CharField(
        max_length=250
    )

    proposed_solution = models.TextField()

    implementation_plan = models.TextField()

    expected_outcomes = models.TextField()

    proposed_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    pilot_duration_months = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.DRAFT
    )

    progress_percentage = models.PositiveIntegerField(
        default=0
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    accepted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    rejected_at = models.DateTimeField(
        null=True,
        blank=True
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.startup.name} → {self.challenge.title}"