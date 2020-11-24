# Imports all data from old db.
# This will need to create relevant equation types, geometries, and equations.
import collections
import os

from api.models import Equation, EquationType, Geometry
from django.contrib.auth.models import User
from django.core.files import File
from pprint import pprint

data_dir = os.path.join(os.getcwd(), "scripts", "db_data")


# Old string look like this:
#   Heat Equation, Cartesian, 1D Semi-infinite Body
# The new model has two fields, coord_system and category. These correspond
# to pieces of the old string like so:
#   coord_system: Cartesian, 1D
#   category: Heat Equation, Semi-infinite Body
#
# I could write complicated parsing logic to parse the old string correctly.
# OR I could just hardcode data one time and be done with it.
EQTYPES = {
  "Heat Equation, 1D Hollow Cylinder": ("Cylinder", "Heat Equation, 1D Hollow"),
  "Heat Equation, 1D Solid Cylinder": ("Cylinder", "Heat Equation, 1D Solid"),
  "Heat Equation, 1D Two Layer Cylinder": ("Cylinder", "Heat Equation 1D Two Layer"),
  "Heat Equation, Cylinder, 2D Steady": ("Cylinder", "Heat Equation, 2D Steady"),
  "Heat Equation, 1D Hollow Sphere": ("Sphere", "Heat Equation, Hollow Sphere"),
  "Heat Equation, 1D Solid Sphere": ("Sphere", "Heat Equation, Solid Sphere"),
  "Heat Equation, Cartesian, 1D Fin": ("Cartesian 1D", "Heat Equation, Fin"),
  "Heat Equation, Cartesian, 1D Infinite Body": ("Cartesian 1D", "Heat Equation, Infinite Body"),
  "Heat Equation, Cartesian, 1D Semi-infinite Body": ("Cartesian 1D", "Heat Equation, Semi-infinite Body"),
  "Heat Equation, Cartesian, 1D Slab Body": ("Cartesian 1D", "Heat Equation, Slab Body"),
  "Heat Equation, Cartesian, 1D Two-layer Slab": ("Cartesian 1D", "Heat Equation, Two-layer Slab"),
  "Heat Equation, Cartesian, 1D steady": ("Cartesian 1D", "Heat Equation, Steady"),
  "Heat Equation, Cartesian, Three Dimensional": ("Cartesian 2D & 3D", "Heat Equation, 2D"),
  "Heat Equation, Cartesian, Two-dimensional": ("Cartesian 2D & 3D", "Heat Equation, 3D"),
  "Lumped body": ("Other", "Lumped Body"),
  "Thermal Wave Equation, 1D Slab Body": ("Cartesian 1D", "Thermal Wave Equation, Slab Body"),
  "Thermal Wave Equation, Cartesian 1D Semi-infinite Body": ("Cartesian 1D", "Thermal Wave Equation, Semi-infinite Body"),
  "Two diffusion equations weakly coupled, Cartesian": ("Other", "Weakly Coupled Diffusion Equations")
}

def get_or_create_geometry(number, file):
  pass

def get_or_create_eqtype(eqtype):
  """Creates a new eqtype model from an old eqtype string."""
  coordinate_system, category = EQTYPES[eqtype]
  obj, created = EquationType.objects.get_or_create(
    coordinate_system=coordinate_system,
    category=category
  )
  return obj

def get_or_create_geometry(number, schematic):
  """Creates a new gemoetry from the number & file."""
  obj, created = Geometry.objects.get_or_create(number=number)
  if created:
    file_path = os.path.join(data_dir, "upload", schematic)
    with open(file_path, "rb") as rh:
      obj.geometry_file.save(schematic, File(rh))
  return obj

def create_or_update_equation(name, author, date, equation_type, geometry, user, source_file, content_file):
  # Date is in the format MM/DD/YYYY, need to change format
  month, day, year = date.split("/")
  formatted_date = f"{year}-{month}-{day}"
  obj, created = Equation.objects.update_or_create(
    name=name,
    author=author,
    date=formatted_date,
    equation_type=equation_type,
    geometry=geometry,
    user=user,
    is_live=True
  )
  if not created:
    return obj

  with open(content_file, "rb") as rh:
    obj.content_file.save(os.path.basename(content_file), File(rh))

  if source_file and os.path.basename(source_file) != "NULL":
    if os.path.isfile(source_file):
      with open(source_file, "rb") as rh:
        obj.source_file.save(os.path.basename(source_file), File(rh))
    else:
      print(f"Error with equation {name}, no such file {os.path.basename(source_file)}")

  return obj



def run():

  # Create a map from uid -> user.
  user_map = {}
  with open(os.path.join(data_dir, "users.txt"), "r") as rh:
    for line in rh.readlines()[1:]:
      uid, username = line.strip().split("\t")[1:3]
      user_map[uid] = User.objects.get(username=username)
  # Please don't ask, I have no clue how these UIDS are missing.
  user_map["25feaeae-4249-11e2-8aa4-08002728c962"] = User.objects.get(username="kcole")
  user_map["676f8e70-26c9-11e3-a939-001aa0ab8ac8"] = User.objects.get(username="kcole")

  with open(os.path.join(data_dir, "page_data.txt"), "r") as rh:
    for line in rh.readlines()[1:]:
      page_data = line.strip().split("\t")
      equation_type = get_or_create_eqtype(page_data[4])
      number, sketch = page_data[5:7]
      geometry = get_or_create_geometry(number, sketch)
      # Create or update our equation with appropriate fields.
      name, author, date = page_data[1:4]
      content_fname, source_fname = page_data[17:19]
      uid = page_data[22]
      content_file = os.path.join(data_dir, "upload", content_fname)
      if not os.path.isfile(content_file):
        print(f"Skipping equation {name}, can't find content file {content_fname}")
        continue
      source_file = os.path.join(data_dir, "upload", source_fname)
      create_or_update_equation(name, author, date, equation_type, geometry,
                               user_map[uid], source_file, content_file)
