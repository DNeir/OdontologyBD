from django.contrib import admin
from myapps.inventory.models import DentalLab, Material, Payment

# Register your models here.


class MaterialAdmin(admin.ModelAdmin):
    list_display = ("nombreMaterial", "stockMaterial")
    search_fields = ("nombreMaterial", "descripcionMaterial")
    ordering = ("nombreMaterial",)

    fieldsets = (
        (
            "Material",
            {"fields": ("nombreMaterial", "descripcionMaterial", "stockMaterial")},
        ),
    )


class DentalLabAdmin(admin.ModelAdmin):
    list_display = ("nombreLab", "telefonoLab")
    search_fields = ("nombreLab", "telefonoLab", "direccionLab")
    ordering = ("nombreLab",)

    fieldsets = (
        (
            "Laboratorio Dental",
            {"fields": ("nombreLab", "telefonoLab", "direccionLab")},
        ),
    )


class PaymentAdmin(admin.ModelAdmin):
    list_display = ("planPayment", "montoPayment", "metodoPayment", "fechaHoraPayment")
    list_filter = ("fechaHoraPayment", "metodoPayment")
    search_fields = (
        "planPayment__pacientePlan__nombrePatient",
        "planPayment__pacientePlan__apellidoPatient",
    )
    ordering = ("-fechaHoraPayment",)

    fieldsets = (
        ("Pago", {"fields": ("planPayment", "montoPayment", "metodoPayment")}),
        ("Registro", {"fields": ("fechaHoraPayment",), "classes": ("collapse",)}),
    )
    readonly_fields = ("fechaHoraPayment",)


admin.site.register(Material, MaterialAdmin)
admin.site.register(DentalLab, DentalLabAdmin)
admin.site.register(Payment, PaymentAdmin)
