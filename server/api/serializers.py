"""Serialize database items.

Manipulate data to make it easier for the client to use.
"""
from rest_framework import serializers
from api import models


class EquationTypeSerializer(serializers.ModelSerializer):
  """Serialize EquationTypes."""

  class Meta:
    model = models.EquationType
    fields = "__all__"


class GeometrySerializer(serializers.ModelSerializer):
  """Serialize Geometrys."""

  class Meta:
    model = models.Geometry
    fields = "__all__"

class EquationSerializer(serializers.ModelSerializer):
  """Serialize Equations."""

  class Meta:
    model = models.Equation
    fields = "__all__"

class PageSerializer(serializers.ModelSerializer):
  """Serialize Pages."""

  class Meta:
    model = models.Page
    fields = "__all__"
