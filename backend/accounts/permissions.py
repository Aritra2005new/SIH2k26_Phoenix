from rest_framework.permissions import BasePermission


class IsGovernment(BasePermission):
    """
    Allows access only to Government users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "GOVERNMENT"
        )


class IsStartup(BasePermission):
    """
    Allows access only to Startup users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "STARTUP"
        )


class IsEvaluator(BasePermission):
    """
    Allows access only to Evaluator users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "EVALUATOR"
        )


class IsAdmin(BasePermission):
    """
    Allows access only to Admin users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )