from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from accounts.permissions import IsGovernment
from accounts.permissions import IsStartup

from challenges.models import Challenge
from startups.models import Startup
from django.db import transaction

from .models import Application


class SelectStartupView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsGovernment
    ]

    def post(self, request):

        challenge_id = request.data.get("challenge_id")
        startup_id = request.data.get("startup_id")

        if not challenge_id or not startup_id:
            return Response(
                {
                    "error": "challenge_id and startup_id are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        challenge = get_object_or_404(
            Challenge,
            id=challenge_id
        )

        startup = get_object_or_404(
            Startup,
            id=startup_id
        )

        # ---------------------------------
        # 1. Challenge must be published
        # ---------------------------------

        if challenge.status != Challenge.Status.PUBLISHED:
            return Response(
                {
                    "error": (
                        "This challenge is not open for "
                        "startup selection."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------
        # 2. Challenge must not be engaged
        # ---------------------------------

        if challenge.is_engaged:
            return Response(
                {
                    "error": (
                        "This challenge has already been accepted "
                        "by a startup and is now engaged."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------
        # 3. Startup must be active
        # ---------------------------------

        if startup.startup_status != Startup.StartupStatus.ACTIVE:
            return Response(
                {
                    "error": "This startup is currently inactive."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------
        # 4. Startup must be verified
        # ---------------------------------

        if startup.verification_status != Startup.VerificationStatus.VERIFIED:
            return Response(
                {
                    "error": "Only verified startups can be selected."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------
        # 5. Prevent duplicate active request
        # ---------------------------------

        existing_application = Application.objects.filter(
            challenge=challenge,
            startup=startup
        ).exclude(
            status=Application.Status.REJECTED
        ).first()

        if existing_application:

            return Response(
                {
                    "error": (
                        "A request has already been sent to "
                        "this startup for this challenge."
                    ),
                    "application_id": existing_application.id,
                    "status": existing_application.status
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------
        # 6. Create application
        # ---------------------------------

        application = Application.objects.create(
            challenge=challenge,
            startup=startup,
            government=request.user,
            status=Application.Status.PENDING_ACCEPTANCE
        )

        # ---------------------------------
        # 7. Create startup notification
        # ---------------------------------

        from notifications.models import Notification

        Notification.objects.create(
            recipient=startup.user,
            notification_type=(
                Notification.NotificationType.STARTUP_SELECTED
            ),
            title="New Challenge Selection",
            message=(
                f"Government user {request.user.username} "
                f"has selected your startup for the challenge "
                f"'{challenge.title}'."
            ),
            application=application
        )

        # ---------------------------------
        # 8. Response
        # ---------------------------------

        return Response(
            {
                "message": (
                    "Startup selection request created successfully."
                ),

                "application_id": application.id,

                "challenge_id": challenge.id,
                "challenge_title": challenge.title,

                "startup_id": startup.id,
                "startup_name": startup.name,

                "government": request.user.username,

                "budget": challenge.budget,
                "pilot_duration": challenge.pilot_duration,

                "status": application.status
            },
            status=status.HTTP_201_CREATED
        )

class StartupApplicationResponseView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStartup
    ]

    def post(self, request, pk):

        startup = get_object_or_404(
            Startup,
            user=request.user
        )

        application = get_object_or_404(
            Application,
            id=pk,
            startup=startup
        )

        if application.status != Application.Status.PENDING_ACCEPTANCE:
            return Response(
                {
                    "error": "This application is no longer pending."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        action = request.data.get("action")

        if action not in ["ACCEPT", "REJECT"]:
            return Response(
                {
                    "error": "action must be ACCEPT or REJECT."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================
        # ACCEPT
        # =================================

        if action == "ACCEPT":

            with transaction.atomic():

                challenge = Challenge.objects.select_for_update().get(
                    id=application.challenge.id
                )

                # Check again inside transaction
                if challenge.is_engaged:

                    return Response(
                        {
                            "error": (
                                "This challenge has already been "
                                "accepted by another startup."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                application.status = Application.Status.ACCEPTED
                application.accepted_at = timezone.now()

                challenge.is_engaged = True

                application.save()

                challenge.save(
                    update_fields=[
                        "is_engaged",
                        "updated_at"
                    ]
                )

            from notifications.models import Notification

            Notification.objects.create(
                recipient=application.government,
                notification_type=Notification.NotificationType.APPLICATION_ACCEPTED,
                title="Application Accepted",
                message=(
                    f"Startup '{startup.name}' has accepted your request "
                    f"for the challenge '{application.challenge.title}'."
                ),
                application=application
            )

            message = "Application accepted successfully."

        # =================================
        # REJECT
        # =================================

        else:

            application.status = Application.Status.REJECTED
            application.rejected_at = timezone.now()

            application.save()

            from notifications.models import Notification

            Notification.objects.create(
                recipient=application.government,
                notification_type=Notification.NotificationType.APPLICATION_REJECTED,
                title="Application Rejected",
                message=(
                    f"Startup '{startup.name}' has rejected your request "
                    f"for the challenge '{application.challenge.title}'."
                ),
                application=application
            )

            message = "Application rejected successfully."

        return Response(
            {
                "message": message,

                "application_id": application.id,

                "startup_id": startup.id,
                "startup_name": startup.name,

                "challenge_id": application.challenge.id,
                "challenge_title": application.challenge.title,

                "status": application.status,

                "budget": application.challenge.budget,
                "pilot_duration": application.challenge.pilot_duration,

                "accepted_at": application.accepted_at,
                "rejected_at": application.rejected_at
            },
            status=status.HTTP_200_OK
        )

class StartupApplicationListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStartup
    ]

    def get(self, request):

        startup = get_object_or_404(
            Startup,
            user=request.user
        )

        applications = Application.objects.filter(
            startup=startup,
            status=Application.Status.PENDING_ACCEPTANCE
        ).select_related(
            "challenge",
            "government"
        )

        data = []

        for application in applications:

            data.append({
                "application_id": application.id,

                "challenge_id": application.challenge.id,
                "challenge_title": application.challenge.title,

                "government": (
                    application.government.username
                    if application.government
                    else None
                ),

                "status": application.status,

                "budget": application.challenge.budget,
                "pilot_duration": application.challenge.pilot_duration,

                "created_at": application.created_at,
            })

        return Response(data)

class GovernmentApplicationListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsGovernment
    ]

    def get(self, request):

        applications = Application.objects.filter(
            government=request.user
        ).select_related(
            "startup",
            "challenge"
        )

        data = []

        for application in applications:

            data.append({
                "application_id": application.id,

                "challenge_id": application.challenge.id,
                "challenge_title": application.challenge.title,

                "startup_id": application.startup.id,
                "startup_name": application.startup.name,

                "status": application.status,
                "progress_percentage": application.progress_percentage,

                "budget": application.challenge.budget,
                "pilot_duration": application.challenge.pilot_duration,

                "accepted_at": application.accepted_at,
                "rejected_at": application.rejected_at,
                "completed_at": application.completed_at,

                "created_at": application.created_at,
                "updated_at": application.updated_at,
            })

        return Response(data)

class StartupProgressUpdateView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStartup
    ]

    def patch(self, request, pk):

        startup = get_object_or_404(
            Startup,
            user=request.user
        )

        application = get_object_or_404(
            Application,
            id=pk,
            startup=startup
        )

        # Only accepted projects can receive progress updates
        if application.status != Application.Status.ACCEPTED:
            return Response(
                {
                    "error": "Only accepted applications can be updated."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        progress = request.data.get("progress_percentage")

        if progress is None:
            return Response(
                {
                    "error": "progress_percentage is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            progress = int(progress)
        except (TypeError, ValueError):
            return Response(
                {
                    "error": "progress_percentage must be a number."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if progress < 0 or progress > 100:
            return Response(
                {
                    "error": (
                        "progress_percentage must be "
                        "between 0 and 100."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if progress < application.progress_percentage:
            return Response(
                {
                    "error": "Progress cannot be decreased."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        application.progress_percentage = progress

        # 100% = project completed
        if progress == 100:

            application.status = Application.Status.COMPLETED
            application.completed_at = timezone.now()

        application.save()

        return Response(
            {
                "message": "Progress updated successfully.",

                "application_id": application.id,

                "startup_id": startup.id,
                "startup_name": startup.name,

                "challenge_id": application.challenge.id,
                "challenge_title": application.challenge.title,

                "progress_percentage": (
                    application.progress_percentage
                ),

                "status": application.status,

                "completed_at": application.completed_at
            },
            status=status.HTTP_200_OK
        )


