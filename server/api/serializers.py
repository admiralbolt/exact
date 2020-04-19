"""Serialize database items.

Manipulate data to make it easier for the client to use.
"""
from rest_framework_json_api import serializers
from api import models

class PrivateField(serializers.Field):

  field_name = ""

  def __init__(self, *args, **kwargs):
    self.field_name = kwargs["field_name"]
    kwargs.pop("field_name")
    super().__init__(*args, **kwargs)

  def get_attribute(self, obj):
    return obj

  def to_representation(self, obj):
    if not self.context:
      return ""

    request = self.context["request"]
    if request.user.is_staff or request.user.id == obj.id:
      return getattr(obj, self.field_name)

  def to_internal_value(self, data):
    return data


class UserSerializer(serializers.ModelSerializer):
  """Serialize django users."""
  username = PrivateField(field_name="username")
  email = PrivateField(field_name="email")
  first_name = PrivateField(field_name="first_name")
  last_name = PrivateField(field_name="last_name")
  password = serializers.SerializerMethodField("get_password")

  def create(self, validated_data):
    user = models.User.objects.create_user(**validated_data)
    return user

  def get_password(self, obj):
    return getattr(obj, "password", None)

  class Meta:
    model = models.ExactUser
    fields = ["username", "password", "email", "first_name", "last_name", "is_staff"]
    extra_kwargs = {
      "password": {"write_only": True}
    }

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
