from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Startup(models.Model):

    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    class StartupStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="startup_profile"
    )

    ml_startup_id = models.IntegerField(
        null=True,
        blank=True,
        unique=True
    )

    name = models.CharField(max_length=200)

    logo = models.ImageField(
        upload_to="startup_logos/",
        null=True,
        blank=True
    )

    description = models.TextField()

    domains = models.TextField()

    technologies = models.TextField()

    solutions = models.TextField()

    keywords = models.TextField()

    target_customers = models.TextField(blank=True)

    past_experience = models.TextField(blank=True)

    team_size = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    founded_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    location = models.CharField(
        max_length=200,
        blank=True
    )

    average_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    eligibility_status = models.CharField(
        max_length=100,
        blank=True
    )

    business_stage = models.CharField(
        max_length=30,
        choices=[
            ("PILOT", "Pilot Stage"),
            ("SCALING", "Scaling"),
            ("UNDER_REVIEW", "Under Review"),
        ],
        default="UNDER_REVIEW"
    )

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING
    )

    startup_status = models.CharField(
        max_length=20,
        choices=StartupStatus.choices,
        default=StartupStatus.ACTIVE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name

class StartupDocument(models.Model):

    class DocumentType(models.TextChoices):
        REGISTRATION = "REGISTRATION", "Registration Certificate"
        COMPANY_PROFILE = "COMPANY_PROFILE", "Company Profile"
        TECHNICAL = "TECHNICAL", "Technical Document"
        FINANCIAL = "FINANCIAL", "Financial Document"
        OTHER = "OTHER", "Other"

    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    title = models.CharField(
        max_length=200
    )

    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices,
        default=DocumentType.OTHER
    )

    file = models.FileField(
        upload_to="startup_documents/"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.startup.name} - {self.title}"


