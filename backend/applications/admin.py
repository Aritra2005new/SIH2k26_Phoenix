from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):

    list_display = (
        "startup",
        "challenge",
        "proposal_title",
        "status",
        "proposed_budget",
        "submitted_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "proposal_title",
        "startup__name",
        "challenge__title",
    )