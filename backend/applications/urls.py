from django.urls import path

from .views import (
    SelectStartupView,
    StartupApplicationListView,
    StartupApplicationResponseView,
    StartupProgressUpdateView,
    GovernmentApplicationListView,
)


urlpatterns = [

    path(
        "select-startup/",
        SelectStartupView.as_view(),
        name="select-startup"
    ),

    path(
        "startup/",
        StartupApplicationListView.as_view(),
        name="startup-applications"
    ),

    path(
        "<int:pk>/respond/",
        StartupApplicationResponseView.as_view(),
        name="startup-application-response"
    ),

    path(
        "<int:pk>/progress/",
        StartupProgressUpdateView.as_view(),
        name="startup-progress-update"
    ),

    path(
        "government/",
        GovernmentApplicationListView.as_view(),
        name="government-applications"
    ),
]