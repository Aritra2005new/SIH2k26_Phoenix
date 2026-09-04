from django.urls import path

from .views import (
    StartupProfileCreateView,
    StartupDetailView,
    MyStartupProfileView,
    StartupDocumentUploadView,
    MyStartupDocumentsView,
    GovernmentStartupDocumentsView,
)


urlpatterns = [

    path(
        "profile/",
        StartupProfileCreateView.as_view(),
        name="startup-profile-create",
    ),
    path(
        "my-profile/",
        MyStartupProfileView.as_view(),
        name="my_startup_profile"
    ),
    path(
        "documents/",
        MyStartupDocumentsView.as_view(),
        name="my_startup_documents"
    ),

    path(
        "documents/upload/",
        StartupDocumentUploadView.as_view(),
        name="startup_document_upload"
    ),

    path(
        "<int:startup_id>/documents/",
        GovernmentStartupDocumentsView.as_view(),
        name="government_startup_documents"
    ),
    path(
        "<int:pk>/",
        StartupDetailView.as_view(),
        name="startup-detail",
    ),




]