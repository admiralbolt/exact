"""Primary api endpoints.

Viewsets are defined here for each of the item types. These viewsets create a
number of standard endpoints for each item i.e. viewing as a list, individual
detail, edit, and delete views.
"""
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from api import models
from api import serializers

# pylint: disable=too-many-ancestors

class EquationTypeViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "equation_types"
  queryset = models.EquationType.objects.all()
  serializer_class = serializers.EquationTypeSerializer

  def get_queryset(self):
    equation_types = models.EquationType.objects.order_by("-ordinal")
    return equation_types


class GeometryViewSet(viewsets.ModelViewSet):
  """View set for equation types."""
  resource_name = "geometrys"
  queryset = models.Geometry.objects.all()
  serializer_class = serializers.GeometrySerializer

  def get_queryset(self):
    equation_types = models.Geometry.objects.order_by("number")
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
  resource_name = "geometrys"
  queryset = models.Page.objects.all()
  serializer_class = serializers.PageSerializer

  def get_queryset(self):
    equation_types = models.Page.objects.order_by("name")
    return equation_types
