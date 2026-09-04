from rest_framework import serializers

from .models import GovernmentDepartment


class GovernmentDepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = GovernmentDepartment

        fields = [
            "id",
            "name",
            "description",
            "contact_email",
            "contact_phone",
            "location",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]