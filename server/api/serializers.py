"""Serialize database items.

Manipulate data to make it easier for the client to use.
"""
from rest_framework_json_api import serializers
from api import models

class UserSerializer(serializers.ModelSerializer):
  """Serialize django users."""

  class Meta:
    model = models.ExactUser
    fields = ["username", "email", "first_name", "last_name", "is_staff"]

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

  class JSONAPIMETA:
    included_resources = ['users']

class PageSerializer(serializers.ModelSerializer):
  """Serialize Pages."""

  class Meta:
    model = models.Page
    fields = "__all__"
