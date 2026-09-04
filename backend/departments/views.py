from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsGovernment

from .models import GovernmentDepartment
from .serializers import GovernmentDepartmentSerializer

class DepartmentListView(generics.ListAPIView):

    queryset = GovernmentDepartment.objects.all()
    serializer_class = GovernmentDepartmentSerializer
    permission_classes = [
        IsAuthenticated,
        IsGovernment
    ]