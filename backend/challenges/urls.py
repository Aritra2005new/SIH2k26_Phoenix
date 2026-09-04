from django.urls import path

from .views import (
    ChallengeListCreateView,
    ChallengeDetailView,
)


urlpatterns = [
    path(
        "",
        ChallengeListCreateView.as_view(),
        name="challenge-list-create"
    ),

    path(
        "<int:pk>/",
        ChallengeDetailView.as_view(),
        name="challenge-detail"
    ),
]