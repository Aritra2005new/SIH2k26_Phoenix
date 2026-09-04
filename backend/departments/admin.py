from django.contrib import admin

from django.contrib import admin
from .models import GovernmentDepartment


@admin.register(GovernmentDepartment)
class GovernmentDepartmentAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "name",
        "contact_email",
        "contact_phone",
        "location",
    ]

    search_fields = (
        "name",
        "location",
        "contact_email",
    )