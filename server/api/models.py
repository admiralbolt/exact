from django.db import models

class EquationType(models.Model):
  name = models.CharField(max_length=128, unique=True)
  ordinal = models.FloatField()

  def __str__(self):
    return self.name


class Geometry(models.Model):
  number = models.CharField(max_length=32)
  geometry_file = models.FileField(upload_to="geometry/")

  def __str__(self):
    return self.number


class Equation(models.Model):
  name = models.CharField(max_length=128, unique=True)
  author = models.CharField(max_length=256)
  date = models.DateField()
  equation_type = models.ForeignKey(EquationType, on_delete=models.PROTECT)
  is_live = models.BooleanField(default=False)
  geometry = models.ForeignKey(Geometry, on_delete=models.PROTECT)
  # Files!
  source_file = models.FileField(upload_to="sources/", blank=True)
  content_file = models.FileField(upload_to="content/")

  def __str__(self):
    return self.name


ADMIN_MODELS = [EquationType, Equation, Geometry]
