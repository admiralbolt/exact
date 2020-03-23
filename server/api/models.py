from django.db import models

class EquationType(models.Model):
  name = models.CharField(max_length=128, unique=True)
  ordinal = models.FloatField()


class Equation(models.Model):
  name = models.CharField(max_length=128, unique=True)
  author = models.CharField(max_length=256)
  date = models.DateField()
  equation_type = models.ForeignKey(EquationType, on_delete=models.PROTECT)
  number = models.CharField(max_length=32)
  # Files!
  geometry_file = models.FileField(upload_to="geometry/")
  source_file = models.FileField(upload_to="sources/")
  content_file = models.FileField(upload_to="content/")

ADMIN_MODELS = [EquationType, Equation]
