from django.urls import path

from .views import ChallengeRecommendationView


urlpatterns = [
    path(
        "challenges/<int:challenge_id>/recommendations/",
        ChallengeRecommendationView.as_view(),
        name="challenge-recommendations",
    ),
]