"""Primary api endpoints.

Viewsets are defined here for each of the item types. These viewsets create a
number of standard endpoints for each item i.e. viewing as a list, individual
detail, edit, and delete views.
"""
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from rest_framework import mixins, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.renderers import JSONRenderer

from api import models
from api import serializers
from api.permissions import IsSameUserOrAdmin

# pylint: disable=too-many-ancestors

class DetailViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet):
  pass

class ListViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet):
  pass

class UserDetailViewSet(DetailViewSet):
  queryset = models.ExactUser.objects.all()
  serializer_class = serializers.UserSerializer
  permission_classes = (IsSameUserOrAdmin,)

class UserViewSet(ListViewSet):
  resource_name = "users"
  queryset = models.ExactUser.objects.all()
  serializer_class = serializers.UserSerializer
  permission_classes = (IsAdminUser,)

  def get_queryset(self):
    return models.ExactUser.objects.all()

class EquationTypeViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "equation-types"
  queryset = models.EquationType.objects.all()
  serializer_class = serializers.EquationTypeSerializer

  def get_queryset(self):
    equation_types = models.EquationType.objects.order_by("coordinate_system", "category")
    return equation_types


class GeometryViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "geometries"
  queryset = models.Geometry.objects.all()
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
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_current_user(request):
  s = serializers.UserSerializer(request.user)
  return JsonResponse({
    "data": {
      "type": "users",
      "id": request.user.id,
      "attributes": s.data
    }
  })

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def new_password(request):
  password = request.GET.get("password")
  request.user.set_password(password)
  request.user.save()
  return JsonResponse({"status": "success", "message": ""})

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
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
@authentication_classes([TokenAuthentication])
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
@authentication_classes([TokenAuthentication])
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
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminUser])
def upload_froala_image(request):
  f = request.data["file"]
  image = models.FroalaImage(image_file=f)
  image.save()
  return JsonResponse({"link": f"http://{request.get_host()}/uploads/{image.image_file.name}"})
