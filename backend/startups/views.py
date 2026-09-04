from rest_framework import generics
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from accounts.permissions import IsStartup

from .models import Startup
from .models import StartupDocument

from .serializers import StartupSerializer
from .serializers import StartupDocumentSerializer
from accounts.permissions import IsGovernment
from .ml_registry import find_ml_startup



class StartupProfileCreateView(generics.CreateAPIView):

    serializer_class = StartupSerializer
    permission_classes = [IsStartup]

    def perform_create(self, serializer):

        startup_name = serializer.validated_data.get("name")

        # Find startup in ML dataset
        ml_startup = find_ml_startup(startup_name)

        # -----------------------------------------
        # Startup NOT present in dataset
        # -----------------------------------------
        if ml_startup is None:

            serializer.save(
                user=self.request.user,
                ml_startup_id=None,
                verification_status=Startup.VerificationStatus.PENDING,
                startup_status=Startup.StartupStatus.ACTIVE
            )

            return

        # -----------------------------------------
        # Startup FOUND in dataset
        # -----------------------------------------

        ml_startup_id = int(ml_startup["id"])

        dataset_verification = str(
            ml_startup["verification_status"]
        ).strip().upper()

        dataset_status = str(
            ml_startup["startup_status"]
        ).strip().upper()

        # Dataset verification → Django verification
        if dataset_verification in ["VERIFIED", "ACCEPTED"]:
            verification_status = Startup.VerificationStatus.VERIFIED
        else:
            verification_status = Startup.VerificationStatus.PENDING

        # Dataset startup status → Django startup status
        if dataset_status == "ACTIVE":
            startup_status = Startup.StartupStatus.ACTIVE
        else:
            startup_status = Startup.StartupStatus.INACTIVE

        # Save everything automatically
        serializer.save(
            user=self.request.user,
            ml_startup_id=ml_startup_id,
            verification_status=verification_status,
            startup_status=startup_status
        )


class StartupDetailView(generics.RetrieveAPIView):

    queryset = Startup.objects.all()
    serializer_class = StartupSerializer
    permission_classes = [IsAuthenticated]


class MyStartupProfileView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsStartup
    ]

    def get(self, request):

        startup = get_object_or_404(
            Startup,
            user=request.user
        )

        serializer = StartupSerializer(startup)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(self, request):

        startup = get_object_or_404(
            Startup,
            user=request.user
        )

        serializer = StartupSerializer(
            startup,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class StartupDocumentUploadView(generics.CreateAPIView):

    serializer_class = StartupDocumentSerializer

    permission_classes = [
        IsAuthenticated,
        IsStartup
    ]

    def perform_create(self, serializer):

        startup = get_object_or_404(
            Startup,
            user=self.request.user
        )

        serializer.save(
            startup=startup
        )

class MyStartupDocumentsView(generics.ListAPIView):

    serializer_class = StartupDocumentSerializer

    permission_classes = [
        IsAuthenticated,
        IsStartup
    ]

    def get_queryset(self):

        startup = get_object_or_404(
            Startup,
            user=self.request.user
        )

        return StartupDocument.objects.filter(
            startup=startup
        )

class GovernmentStartupDocumentsView(generics.ListAPIView):

    serializer_class = StartupDocumentSerializer

    permission_classes = [
        IsAuthenticated,
        IsGovernment
    ]

    def get_queryset(self):

        startup = get_object_or_404(
            Startup,
            id=self.kwargs["startup_id"]
        )

        return StartupDocument.objects.filter(
            startup=startup
        )