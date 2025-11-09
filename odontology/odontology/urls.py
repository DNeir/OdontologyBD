from django.conf.urls import include
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    # Deprecated
    # path("clinic/", include("myapps.clinic.urls_viewset")),
    # path("inventory/", include("myapps.inventory.urls")),
    # path("patients/", include("myapps.patients.urls")),
    # APIs
    path("api/clinic/", include("myapps.clinic.urls_viewset")),
    path("api/inventory/", include("myapps.inventory.urls_generic")),
    path("api/patients/", include("myapps.patients.urls_apiview")),
]
