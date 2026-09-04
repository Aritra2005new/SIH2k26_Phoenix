from rest_framework import serializers

from .models import Startup
from .models import Startup, StartupDocument


class StartupSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = Startup

        fields = [
            "id",
            "name",
            "logo",
            "email",
            "description",
            "domains",
            "technologies",
            "solutions",
            "keywords",
            "target_customers",
            "past_experience",
            "team_size",
            "founded_year",
            "location",
            "average_budget",
            "eligibility_status",
            "business_stage",
            "verification_status",
            "startup_status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "ml_startup_id",
            "verification_status",
            "startup_status",            "created_at",
            "updated_at",
        ]

class StartupDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = StartupDocument
        fields = [
            "id",
            "title",
            "document_type",
            "file",
            "uploaded_at",
        ]

        read_only_fields = [
            "id",
            "uploaded_at",
            "verification_status",
            "startup_status",
        ]