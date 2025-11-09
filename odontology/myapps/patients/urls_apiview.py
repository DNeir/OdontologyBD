from django.urls import path

from .views_apiview import (
    AppointmentListCreateAPIView,
    AppointmentRetrieveUpdateDestroyAPIView,
    DentalHistoryListCreateAPIView,
    DentalHistoryRetrieveUpdateDestroyAPIView,
    PatientListCreateAPIView,
    PatientRetrieveUpdateDestroyAPIView,
)

urlpatterns = [
    # Patients
    path("patients/", PatientListCreateAPIView.as_view(), name="patient-list-create"),
    path(
        "patients/<int:pk>/",
        PatientRetrieveUpdateDestroyAPIView.as_view(),
        name="patient-rud",
    ),
    # Dental histories
    path(
        "histories/",
        DentalHistoryListCreateAPIView.as_view(),
        name="history-list-create",
    ),
    path(
        "histories/<int:pk>/",
        DentalHistoryRetrieveUpdateDestroyAPIView.as_view(),
        name="history-rud",
    ),
    # Appointments
    path(
        "appointments/",
        AppointmentListCreateAPIView.as_view(),
        name="appointment-list-create",
    ),
    path(
        "appointments/<int:pk>/",
        AppointmentRetrieveUpdateDestroyAPIView.as_view(),
        name="appointment-rud",
    ),
]
