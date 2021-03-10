"""Primary api endpoints.

Viewsets are defined here for each of the item types. These viewsets create a
number of standard endpoints for each item i.e. viewing as a list, individual
detail, edit, and delete views.
"""
import os

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.core.files.storage import default_storage
from rest_framework import mixins, viewsets
from rest_framework_expiring_authtoken.authentication import ExpiringTokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.renderers import JSONRenderer

from api import models
from api import serializers
from api.permissions import EquationPermission, IsSameUserOrAdmin, UserPermission
from api.search import run_search

# pylint: disable=too-many-ancestors

class UserViewSet(viewsets.ModelViewSet):
  resource_name = "users"
  queryset = models.ExactUser.objects.all()
  permission_classes = (UserPermission,)
  serializer_class = serializers.UserSerializer

  def get_queryset(self):
    return models.ExactUser.objects.all()

class EquationTypeViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "equation-types"
  queryset = models.EquationType.objects.all()
  permission_classes = (IsAuthenticatedOrReadOnly,)
  serializer_class = serializers.EquationTypeSerializer

  def get_queryset(self):
    equation_types = models.EquationType.objects.order_by("coordinate_system", "category")
    return equation_types


class GeometryViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "geometries"
  queryset = models.Geometry.objects.all()
  permission_classes = (IsAuthenticatedOrReadOnly,)
  serializer_class = serializers.GeometrySerializer

  def get_queryset(self):
    equation_types = models.Geometry.objects.order_by("number")
    number = self.request.query_params.get("number")
    if number is not None:
      equation_types = equation_types.filter(number=number)
    return equation_types


class EquationViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "equations"
  queryset = models.Equation.objects.all()
  serializer_class = serializers.EquationSerializer
  permission_classes = (EquationPermission,)

  def get_queryset(self):
    equation_types = models.Equation.objects.order_by("name")
    return equation_types if self.request.user.is_authenticated else equation_types.filter(is_live=True)

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)


class PageViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "pages"
  queryset = models.Page.objects.all()
  serializer_class = serializers.PageSerializer

  def get_queryset(self):
    equation_types = models.Page.objects.order_by("name")
    return equation_types


@api_view(["GET"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([AllowAny])
def search(request):
  keyword = request.GET.get("keyword")
  if not keyword:
    return JsonResponse({
      "status": "error",
      "message": "No keyword supplied"
    })
  results = run_search(keyword)
  return JsonResponse(results[:10], safe=False)

@api_view(["GET"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def get_current_user(request):
  s = serializers.UserSerializer(request.user, context={"request": request})
  return JsonResponse({
    "data": {
      "type": "users",
      "id": request.user.id,
      "attributes": s.data
    }
  })

@api_view(["POST"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def new_password(request):
  if request.GET.get("user_id"):
    user = models.ExactUser.objects.get(id=request.GET.get("user_id"))
  else:
    user = request.user

  current_password = request.GET.get("current_password")
  if request.user.is_staff and user.id != request.user.id:
    pass
  elif not user.check_password(current_password):
    return JsonResponse({"status": "failure", "message": "Current password is incorrect."})

  password = request.GET.get("password")
  user.set_password(password)
  user.save()
  return JsonResponse({"status": "success", "message": ""})

@api_view(["POST"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_geometry_file(request):
  """Save a geometry schematic file to a geometry."""
  try:
    geometry = models.Geometry.objects.get(id=request.GET.get("id"))
  except ObjectDoesNotExist:
    return JsonResponse({
      "status": "failure",
      "message": f"Could not find geometry with id = {request.GET.get('id')}"
    })
  f = request.data["file"]
  geometry.geometry_file.save(f.name, f, save=True)
  return JsonResponse({"status": "success", "message": ""})

@api_view(["POST"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_source_file(request):
  """Save a source file to an equation."""
  try:
    equation = models.Equation.objects.get(id=request.GET.get("id"))
  except ObjectDoesNotExist:
    return JsonResponse({
      "status": "failure",
      "message": f"Could not find equation with id = {request.GET.get('id')}"
    })
  f = request.data["file"]
  equation.source_file.save(f.name, f, save=True)
  return JsonResponse({"status": "success", "message": ""})

@api_view(["POST"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_content_file(request):
  """Save a content file to an equation."""
  try:
    equation = models.Equation.objects.get(id=request.GET.get("id"))
  except ObjectDoesNotExist:
    return JsonResponse({
      "status": "failure",
      "message": f"Could not find equation with id = {request.GET.get('id')}"
    })
  f = request.data["file"]
  equation.content_file.save(f.name, f, save=True)
  return JsonResponse({"status": "success", "message": ""})

@api_view(["POST"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAdminUser])
def upload_froala_image(request):
  f = request.data["file"]
  image = models.FroalaImage(image_file=f)
  image.save()
  return JsonResponse({"link": f"http://{request.get_host()}/uploads/{image.image_file.name}"})

@api_view(["POST"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAdminUser])
def upload_misc_file(request):
  f = request.data["file"]
  default_storage.save(os.path.join("misc", f.name), f)
  return JsonResponse({"status": "success", "message": ""})

@api_view(["POST"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAdminUser])
def delete_misc_file(request):
  file_name = request.GET.get("file_name")
  if not file_name:
    return JsonResponse({"status": "failure", "message": "Cannot delete non-existant file."})

  default_storage.delete(os.path.join("misc", file_name))
  return JsonResponse({"status": "success", "message": "File deleted successfully."})

@api_view(["GET"])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([AllowAny])
def list_misc_files(request):
  dirs, files = default_storage.listdir("misc")
  return JsonResponse({
    "files": files
  })
