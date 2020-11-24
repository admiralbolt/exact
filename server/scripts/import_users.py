# Imports users from the old database.
# Only adds them if they don't exist and gives them random passwords.
import os
import random
import string

from django.contrib.auth.models import User


def generate_password(length=24):
  """Generates a random password.

  Uses a bunch of randomly generated characters as the password.
  The point is to be secure, not to be remembered.
  """
  chars = string.ascii_lowercase + "1234567890!@#$%^&*()_+"
  return "".join([random.choice(chars) for _ in range(length)])

def run():
  data_dir = os.path.join(os.getcwd(), "scripts", "db_data")

  users = []
  with open(os.path.join(data_dir, "users.txt"), "r") as rh:
    for line in rh.readlines()[1:]:
      info = line.strip().split("\t")
      username, fullname, email = info[2:5]
      info = fullname.split()
      first_name = info[0]
      # Some last names have spaces and/or middle name chars.
      last_name = " ".join(info[1:])

      User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=generate_password()
      )
