from rest_framework import permissions

class IsOwner(permissions.BasePermission):

  def has_object_permission(self, request, view, obj):
    return obj.user == request.user


class IsSameUserOrAdmin(permissions.BasePermission):

  def has_object_permission(self, request, view, obj):
    if request.user is None:
      return False

    return request.user.is_superuser or obj == request.user 
