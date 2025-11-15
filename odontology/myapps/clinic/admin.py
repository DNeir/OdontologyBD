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
    list_display = ("dentistName", "dentistLastName", "dentistSpecialty")
    search_fields = ("dentistName", "dentistLastName", "dentistSpecialty")
    ordering = ("dentistLastName", "dentistName")

    fieldsets = (
        (
            "Dentist Information",
            {"fields": ("dentistName", "dentistLastName", "dentistSpecialty")},
        ),
    )


class ToothAdmin(admin.ModelAdmin):
    list_display = ("toothNumber", "toothDescription")
    search_fields = ("toothNumber", "toothDescription")
    ordering = ("toothNumber",)

    fieldsets = (("Tooth", {"fields": ("toothNumber", "toothDescription")}),)


class TreatmentAdmin(admin.ModelAdmin):
    list_display = ("treatmentName", "treatmentCost")
    search_fields = ("treatmentName", "treatmentDescription")
    ordering = ("treatmentName",)

    fieldsets = (
        (
            "Treatment",
            {"fields": ("treatmentName", "treatmentDescription", "treatmentCost")},
        ),
    )


class ProcedureInline(admin.TabularInline):
    model = Procedure
    extra = 1


class TreatmentPlanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "planPatient",
        "planDentist",
        "planStartDate",
        "planStatus",
    )
    list_filter = ("planStatus", "planStartDate", "planDentist")
    search_fields = (
        "planPatient__patientName",
        "planPatient__patientLastName",
        "planDentist__dentistName",
        "planDentist__dentistLastName",
    )
    ordering = ("-planStartDate",)

    fieldsets = (
        (
            "Treatment Plan",
            {
                "fields": (
                    "planPatient",
                    "planDentist",
                    "planStartDate",
                    "planEndDate",
                    "planStatus",
                )
            },
        ),
    )
    inlines = [ProcedureInline]


class ProcedureAdmin(admin.ModelAdmin):
    list_display = (
        "procedurePlan",
        "procedureTreatment",
        "procedureTooth",
        "procedureDate",
    )
    list_filter = ("procedureDate", "procedureTreatment", "procedureTooth")
    search_fields = (
        "procedurePlan__planPatient__patientName",
        "procedurePlan__planPatient__patientLastName",
        "procedureTreatment__treatmentName",
    )
    ordering = ("-procedureDate",)

    fieldsets = (
        (
            "Procedure",
            {
                "fields": (
                    "procedurePlan",
                    "procedureTreatment",
                    "procedureTooth",
                    "procedureDate",
                )
            },
        ),
        ("Observations", {"fields": ("procedureNotes",)}),
    )


class TreatmentMaterialAdmin(admin.ModelAdmin):
    list_display = ("tmTreatment", "tmMaterial", "tmQuantity")
    list_filter = ("tmTreatment", "tmMaterial")
    search_fields = ("tmTreatment__treatmentName", "tmMaterial__materialName")

    fieldsets = (
        (
            "Material Assignment",
            {"fields": ("tmTreatment", "tmMaterial", "tmQuantity")},
        ),
    )


admin.site.register(Dentist, DentistAdmin)
admin.site.register(Tooth, ToothAdmin)
admin.site.register(Treatment, TreatmentAdmin)
admin.site.register(TreatmentPlan, TreatmentPlanAdmin)
admin.site.register(Procedure, ProcedureAdmin)
admin.site.register(TreatmentMaterial, TreatmentMaterialAdmin)
