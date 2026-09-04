from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsGovernment

from .models import Challenge
from startups.models import Startup
from .serializers import ChallengeSerializer
from matching.matching_service import get_recommendations

class ChallengeListCreateView(generics.ListCreateAPIView):

    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer

    def get_permissions(self):

        if self.request.method == "POST":
            return [IsGovernment()]

        return [IsAuthenticated()]


class ChallengeDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer

    def get_permissions(self):

        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsGovernment()]

        return [IsAuthenticated()]

class ChallengeRecommendationView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, challenge_id):

        try:
            challenge = Challenge.objects.get(
                id=challenge_id
            )

        except Challenge.DoesNotExist:

            return Response(
                {
                    "error": "Challenge not found"
                },
                status=404
            )

        challenge_text = " ".join([
            challenge.title or "",
            challenge.problem_statement or "",
            challenge.desired_outcome or "",
            challenge.eligibility_criteria or "",
            challenge.required_technologies or "",
            challenge.required_domains or "",
        ])

        recommendations = get_recommendations(
            challenge_text,
            top_k=5
        )

        final_recommendations = []

        for recommendation in recommendations:

            ml_startup_id = recommendation["startup_id"]

            startup = Startup.objects.filter(
                ml_startup_id=ml_startup_id
            ).first()

            if startup:

                recommendation["django_startup_id"] = startup.id
                recommendation["profile_available"] = True

                recommendation["verification_status"] = (
                    startup.verification_status
                )

                recommendation["startup_status"] = (
                    startup.startup_status
                )

                recommendation["selectable"] = (
                    startup.verification_status
                    == Startup.VerificationStatus.VERIFIED
                    and
                    startup.startup_status
                    == Startup.StartupStatus.ACTIVE
                )

            else:

                recommendation["django_startup_id"] = None
                recommendation["profile_available"] = False

                recommendation["verification_status"] = None
                recommendation["startup_status"] = None

                recommendation["selectable"] = False

            final_recommendations.append(
                recommendation
            )

        return Response({
            "challenge_id": challenge.id,
            "challenge_title": challenge.title,
            "recommendations": final_recommendations,
        })