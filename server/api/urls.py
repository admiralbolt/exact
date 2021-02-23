"""Route urls -> views."""

from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_expiring_authtoken.views import obtain_expiring_auth_token

from api import views

router = routers.DefaultRouter(trailing_slash=False)  # pylint: disable=invalid-name
router.register(r"geometrys", views.GeometryViewSet)
router.register(r"equation_types", views.EquationTypeViewSet)
router.register(r"equations", views.EquationViewSet)
router.register(r"pages", views.PageViewSet)
router.register(r"users", views.UserViewSet)

urlpatterns = [
  path("api-auth-token/", obtain_expiring_auth_token),
  path("geometries/upload/", views.upload_geometry_file),
  path("equations/upload/source/", views.upload_source_file),
  path("equations/upload/content/", views.upload_content_file),
  path("froala/upload/", views.upload_froala_image),
  path("misc_files/list/", views.list_misc_files),
  path("misc_files/upload/", views.upload_misc_file),
  path("misc_files/delete/", views.delete_misc_file),
  path("users/me/", views.get_current_user),
  path("search/", views.search),
  path("new_password/", views.new_password),
  url(r"password_reset/", include("django_rest_passwordreset.urls", namespace="password_reset")),
  url(r"^", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
