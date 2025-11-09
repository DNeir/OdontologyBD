from django.urls import path

from .views_generic import (
    DentalLabListCreateView,
    DentalLabRetrieveUpdateDestroyView,
    MaterialListCreateView,
    MaterialRetrieveUpdateDestroyView,
    PaymentListCreateView,
    PaymentRetrieveUpdateDestroyView,
)

urlpatterns = [
    path(
        "dental-labs/", DentalLabListCreateView.as_view(), name="dental-lab-list-create"
    ),
    path(
        "dental-labs/<int:pk>/",
        DentalLabRetrieveUpdateDestroyView.as_view(),
        name="dental-detail",
    ),
    path("materials/", MaterialListCreateView.as_view(), name="material-list-create"),
    path(
        "materials/<int:pk>/",
        MaterialRetrieveUpdateDestroyView.as_view(),
        name="material-detail",
    ),
    path("payments/", PaymentListCreateView.as_view(), name="payment-list-create"),
    path(
        "payments/<int:pk>/",
        PaymentRetrieveUpdateDestroyView.as_view(),
        name="payment-detail",
    ),
]
