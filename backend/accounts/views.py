from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    RegisterSerializer,
    MyTokenObtainPairSerializer
)

from .permissions import IsGovernment

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class GovernmentTestView(APIView):
    permission_classes = [IsGovernment]
    def get(self, request):
        return Response({
            "message": "Government access successful",
            "username": request.user.username,
            "role": request.user.role
        })