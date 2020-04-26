from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
      print("importing")
      import api.signals
