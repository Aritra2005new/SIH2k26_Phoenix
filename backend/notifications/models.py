from django.db import models
from django.conf import settings


class Notification(models.Model):

    class NotificationType(models.TextChoices):
        STARTUP_SELECTED = "STARTUP_SELECTED", "Startup Selected"
        APPLICATION_ACCEPTED = "APPLICATION_ACCEPTED", "Application Accepted"
        APPLICATION_REJECTED = "APPLICATION_REJECTED", "Application Rejected"
        PROGRESS_UPDATED = "PROGRESS_UPDATED", "Progress Updated"
        PROJECT_COMPLETED = "PROJECT_COMPLETED", "Project Completed"

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices
    )

    title = models.CharField(
        max_length=200
    )

    message = models.TextField()

    application = models.ForeignKey(
        "applications.Application",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.recipient.username} - {self.title}"