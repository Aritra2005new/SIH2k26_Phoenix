from django.contrib import admin
from .models import Challenge


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "department",
        "status",
        "budget",
        "pilot_duration",
        "created_at",
    )

    list_filter = (
        "status",
        "department",
    )

    search_fields = (
        "title",
        "problem_statement",
        "required_technologies",
        "required_domains",
    )