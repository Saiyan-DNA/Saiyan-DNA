from rest_framework import permissions

SAFE_METHODS = ('GET', 'HEAD', 'OPTIONS')

class ReadOnly(permissions.BasePermission):
    """
    Endpoint is read-only
    """

    def has_permission(self, request, view):
        return (
            request.method in SAFE_METHODS
        )