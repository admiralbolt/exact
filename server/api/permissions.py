from rest_framework import permissions

class IsOwner(permissions.BasePermission):

  def has_object_permission(self, request, view, obj):
    return obj.user == request.user


class IsSameUserOrAdmin(permissions.BasePermission):

  def has_object_permission(self, request, view, obj):
    if request.user is None:
      return False

    return request.user.is_superuser or obj == request.user

class EquationPermission(permissions.BasePermission):

  public_actions = ['list', 'retrieve']
  update_actions = ['update', 'partial_update']

  def has_permission(self, request, view):
    return (
      view.action in self.public_actions or
      view.action in self.update_actions or
      (request.user and request.user.is_staff) or
      (view.action == 'create' and request.user and request.user.is_authenticated)
    )

  def has_object_permission(self, request, view, obj):
    return (
      view.action in self.public_actions or
      (request.user and request.user.is_staff) or
      (view.action in self.update_actions and obj.user.id == request.user.id)
    )

class UserPermission(permissions.BasePermission):

  public_actions = ['list', 'retrieve']
  update_actions = ['update', 'partial_update']

  def has_permission(self, request, view):
    return (
      view.action in self.public_actions or
      view.action in self.update_actions or
      (request.user and request.user.is_staff)
    )

  def has_object_permission(self, request, view, obj):
    return (
      view.action in self.public_actions or
      (request.user and request.user.is_staff) or
      (view.action in self.update_actions and obj.id == request.user.id)
    )
