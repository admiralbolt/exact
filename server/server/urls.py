"""Route urls -> views."""

from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from api import views

router = routers.DefaultRouter(trailing_slash=False)  # pylint: disable=invalid-name

urlpatterns = [
  path("api-auth-token/", obtain_auth_token),
  url(r"^", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
