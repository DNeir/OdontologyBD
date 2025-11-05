from django.contrib import admin
from myapps.clinic.models import (
    Dentist,
    Procedure,
    Tooth,
    Treatment,
    TreatmentMaterial,
    TreatmentPlan,
)

# Register your models here.


class DentistAdmin(admin.ModelAdmin):
    list_display = ("nombreDentist", "apellidoDentist", "especialidadDentist")
    search_fields = ("nombreDentist", "apellidoDentist", "especialidadDentist")
    ordering = ("apellidoDentist", "nombreDentist")

    fieldsets = (
        (
            "Información del Dentista",
            {"fields": ("nombreDentist", "apellidoDentist", "especialidadDentist")},
        ),
    )


class ToothAdmin(admin.ModelAdmin):
    list_display = ("numeroTooth", "descripcionTooth")
    search_fields = ("numeroTooth", "descripcionTooth")
    ordering = ("numeroTooth",)

    fieldsets = (("Diente", {"fields": ("numeroTooth", "descripcionTooth")}),)


class TreatmentAdmin(admin.ModelAdmin):
    list_display = ("nombreTreatment", "costoTreatment")
    search_fields = ("nombreTreatment", "descripcionTreatment")
    ordering = ("nombreTreatment",)

    fieldsets = (
        (
            "Tratamiento",
            {"fields": ("nombreTreatment", "descripcionTreatment", "costoTreatment")},
        ),
    )


class ProcedureInline(admin.TabularInline):
    model = Procedure
    extra = 1


class TreatmentPlanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pacientePlan",
        "dentistaPlan",
        "fechaInicioPlan",
        "estadoPlan",
    )
    list_filter = ("estadoPlan", "fechaInicioPlan", "dentistaPlan")
    search_fields = (
        "pacientePlan__nombrePatient",
        "pacientePlan__apellidoPatient",
        "dentistaPlan__nombreDentist",
        "dentistaPlan__apellidoDentist",
    )
    ordering = ("-fechaInicioPlan",)

    fieldsets = (
        (
            "Plan de Tratamiento",
            {
                "fields": (
                    "pacientePlan",
                    "dentistaPlan",
                    "fechaInicioPlan",
                    "fechaFinPlan",
                    "estadoPlan",
                )
            },
        ),
    )
    inlines = [ProcedureInline]


class ProcedureAdmin(admin.ModelAdmin):
    list_display = (
        "planProcedure",
        "tratamientoProcedure",
        "dienteProcedure",
        "fechaProcedure",
    )
    list_filter = ("fechaProcedure", "tratamientoProcedure", "dienteProcedure")
    search_fields = (
        "planProcedure__pacientePlan__nombrePatient",
        "planProcedure__pacientePlan__apellidoPatient",
        "tratamientoProcedure__nombreTreatment",
    )
    ordering = ("-fechaProcedure",)

    fieldsets = (
        (
            "Procedimiento",
            {
                "fields": (
                    "planProcedure",
                    "tratamientoProcedure",
                    "dienteProcedure",
                    "fechaProcedure",
                )
            },
        ),
        ("Observaciones", {"fields": ("observacionesProcedure",)}),
    )


class TreatmentMaterialAdmin(admin.ModelAdmin):
    list_display = ("tratamientoTm", "materialTm", "cantidadTm")
    list_filter = ("tratamientoTm", "materialTm")
    search_fields = ("tratamientoTm__nombreTreatment", "materialTm__nombreMaterial")

    fieldsets = (
        (
            "Asignación de Material",
            {"fields": ("tratamientoTm", "materialTm", "cantidadTm")},
        ),
    )


admin.site.register(Dentist, DentistAdmin)
admin.site.register(Tooth, ToothAdmin)
admin.site.register(Treatment, TreatmentAdmin)
admin.site.register(TreatmentPlan, TreatmentPlanAdmin)
admin.site.register(Procedure, ProcedureAdmin)
admin.site.register(TreatmentMaterial, TreatmentMaterialAdmin)
