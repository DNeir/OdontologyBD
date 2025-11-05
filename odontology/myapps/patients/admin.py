from django.contrib import admin
from myapps.patients.models import Appointment, DentalHistory, Patient


# Register your models here.
class PatientAdmin(admin.ModelAdmin):
    list_display = (
        "nombrePatient",
        "apellidoPatient",
        "fechaNacimientoPatient",
        "telefonoPatient",
    )
    list_filter = ("fechaNacimientoPatient",)
    search_fields = (
        "nombrePatient",
        "apellidoPatient",
        "telefonoPatient",
        "direccionPatient",
    )
    ordering = ("apellidoPatient", "nombrePatient")

    fieldsets = (
        (
            "Información Personal",
            {"fields": ("nombrePatient", "apellidoPatient", "fechaNacimientoPatient")},
        ),
        ("Contacto", {"fields": ("telefonoPatient", "direccionPatient")}),
    )


class DentalHistoryAdmin(admin.ModelAdmin):
    list_display = ("pacienteHistory",)
    search_fields = (
        "pacienteHistory__nombrePatient",
        "pacienteHistory__apellidoPatient",
    )
    ordering = ("pacienteHistory__apellidoPatient", "pacienteHistory__nombrePatient")

    fieldsets = (
        ("Paciente", {"fields": ("pacienteHistory",)}),
        ("Historia", {"fields": ("anamnesisHistory",)}),
    )


class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "pacienteAppointment",
        "dentistaAppointment",
        "fechaHoraAppointment",
        "motivoAppointment",
    )
    list_filter = ("fechaHoraAppointment", "dentistaAppointment")
    search_fields = (
        "pacienteAppointment__nombrePatient",
        "pacienteAppointment__apellidoPatient",
        "motivoAppointment",
    )
    ordering = ("-fechaHoraAppointment",)

    fieldsets = (
        (
            "Cita",
            {
                "fields": (
                    "pacienteAppointment",
                    "dentistaAppointment",
                    "fechaHoraAppointment",
                )
            },
        ),
        ("Motivo / Observaciones", {"fields": ("motivoAppointment",)}),
    )


admin.site.register(Patient, PatientAdmin)
admin.site.register(DentalHistory, DentalHistoryAdmin)
admin.site.register(Appointment, AppointmentAdmin)
