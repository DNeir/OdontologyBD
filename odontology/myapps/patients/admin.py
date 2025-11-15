from django.contrib import admin
from myapps.patients.models import Appointment, DentalHistory, Patient


# Register your models here.
class PatientAdmin(admin.ModelAdmin):
    list_display = (
        "patientName",
        "patientLastName",
        "patientBirthDate",
        "patientPhone",
    )
    list_filter = ("patientBirthDate",)
    search_fields = (
        "patientName",
        "patientLastName",
        "patientPhone",
        "patientAddress",
    )
    ordering = ("patientLastName", "patientName")

    fieldsets = (
        (
            "Personal Information",
            {"fields": ("patientName", "patientLastName", "patientBirthDate")},
        ),
        ("Contact", {"fields": ("patientPhone", "patientAddress")}),
    )


class DentalHistoryAdmin(admin.ModelAdmin):
    list_display = ("historyPatient",)
    search_fields = (
        "historyPatient__patientName",
        "historyPatient__patientLastName",
    )
    ordering = ("historyPatient__patientLastName", "historyPatient__patientName")

    fieldsets = (
        ("Patient", {"fields": ("historyPatient",)}),
        ("History", {"fields": ("historyAnamnesis",)}),
    )


class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "appointmentPatient",
        "appointmentDentist",
        "appointmentDateTime",
        "appointmentReason",
    )
    list_filter = ("appointmentDateTime", "appointmentDentist")
    search_fields = (
        "appointmentPatient__patientName",
        "appointmentPatient__patientLastName",
        "appointmentReason",
    )
    ordering = ("-appointmentDateTime",)

    fieldsets = (
        (
            "Appointment",
            {
                "fields": (
                    "appointmentPatient",
                    "appointmentDentist",
                    "appointmentDateTime",
                )
            },
        ),
        ("Reason / Notes", {"fields": ("appointmentReason",)}),
    )


admin.site.register(Patient, PatientAdmin)
admin.site.register(DentalHistory, DentalHistoryAdmin)
admin.site.register(Appointment, AppointmentAdmin)
