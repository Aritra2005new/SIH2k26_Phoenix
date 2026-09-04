from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from challenges.models import Challenge
from startups.models import Startup

from .matching_service import get_recommendations


class ChallengeRecommendationView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, challenge_id):

        # -----------------------------------
        # 1. Get challenge
        # -----------------------------------

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

        # -----------------------------------
        # 2. Build challenge text
        # -----------------------------------

        challenge_text = " ".join([
            challenge.title or "",
            challenge.problem_statement or "",
            challenge.desired_outcome or "",
            challenge.eligibility_criteria or "",
            challenge.required_technologies or "",
            challenge.required_domains or "",
        ])

        # -----------------------------------
        # 3. Get top 5 ML recommendations
        # -----------------------------------

        recommendations = get_recommendations(
            challenge_text,
            top_k=5
        )

        final_recommendations = []

        # -----------------------------------
        # 4. Connect ML startup ID
        #    with Django Startup
        # -----------------------------------

        for recommendation in recommendations:

            ml_startup_id = recommendation.get(
                "startup_id"
            )

            startup = Startup.objects.filter(
                ml_startup_id=ml_startup_id
            ).first()

            # --------------------------------
            # Startup exists in Django
            # --------------------------------

            if startup:

                is_verified = (
                    startup.verification_status
                    == Startup.VerificationStatus.VERIFIED
                )

                is_active = (
                    startup.startup_status
                    == Startup.StartupStatus.ACTIVE
                )

                is_selectable = (
                    is_verified
                    and is_active
                )

                recommendation.update({

                    "django_startup_id": startup.id,

                    "profile_available": True,

                    "verification_status":
                        startup.verification_status,

                    "startup_status":
                        startup.startup_status,

                    "is_verified":
                        is_verified,

                    "is_active":
                        is_active,

                    "is_selectable":
                        is_selectable,
                })

            # --------------------------------
            # ML startup does not have
            # Django profile
            # --------------------------------

            else:

                recommendation.update({

                    "django_startup_id": None,

                    "profile_available": False,

                    "verification_status": None,

                    "startup_status": None,

                    "is_verified": False,

                    "is_active": False,

                    "is_selectable": False,
                })

            final_recommendations.append(
                recommendation
            )

        # -----------------------------------
        # 5. Response
        # -----------------------------------

        return Response({

            "challenge_id": challenge.id,

            "challenge_title": challenge.title,

            "recommendations":
                final_recommendations,

        })