"""Stuff for the default admin site!

The thing you're probably interested in is the ADMIN_MODELS defined in models.py
"""

from django.contrib import admin
from api.models import ADMIN_MODELS

for model in ADMIN_MODELS:
  admin.site.register(model)
