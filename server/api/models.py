from django.db import models
from django.contrib.auth.models import User

class EquationType(models.Model):
  coordinate_system = models.CharField(max_length=64)
  category = models.CharField(max_length=128)

  def __str__(self):
    return f"{self.coordinate_system} - {self.category}"

  class Meta:
    unique_together = ("coordinate_system", "category")
    indexes = [
      models.Index(fields=["coordinate_system"])
    ]

  class JSONAPIMeta:
    resource_name = "equation-types"


class Geometry(models.Model):
  number = models.CharField(max_length=32, unique=True)
  geometry_file = models.FileField(upload_to="geometry/", blank=True)

  def __str__(self):
    return self.number

  class JSONAPIMeta:
    resource_name = "geometries"

  class Meta:
    indexes = [
      models.Index(fields=["number"])
    ]

class ExactUser(User):

  class Meta:
    proxy = True

  class JSONAPIMeta:
    resource_name = "users"


class Equation(models.Model):
  name = models.CharField(max_length=256, unique=True)
  author = models.CharField(max_length=256)
  date = models.DateField()
  equation_type = models.ForeignKey(EquationType, on_delete=models.PROTECT)
  geometry = models.ForeignKey(Geometry, on_delete=models.PROTECT)
  user = models.ForeignKey(ExactUser, on_delete=models.PROTECT)
  is_live = models.BooleanField(default=False)
  # Files!
  source_file = models.FileField(upload_to="sources/", blank=True)
  content_file = models.FileField(upload_to="content/", blank=True)

  def __str__(self):
    return self.name

  class JSONAPIMeta:
    resource_name = "equations"


# Used to store html content for a static page.
class Page(models.Model):
  name = models.CharField(max_length=128, unique=True)
  content = models.TextField()

  def __str__(self):
    return self.name

  class JSONAPIMeta:
    resource_name = "pages"

  class Meta:
    indexes = [
      models.Index(fields=["name"])
    ]

class FroalaImage(models.Model):
  image_file = models.ImageField(upload_to="images/")

ADMIN_MODELS = [EquationType, Equation, FroalaImage, Geometry, Page]
