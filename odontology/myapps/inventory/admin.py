from django.contrib import admin
from myapps.inventory.models import DentalLab, Material, Payment

# Register your models here.


class MaterialAdmin(admin.ModelAdmin):
    list_display = ("materialName", "materialStock")
    search_fields = ("materialName", "materialDescription")
    ordering = ("materialName",)

    fieldsets = (
        (
            "Material",
            {"fields": ("materialName", "materialDescription", "materialStock")},
        ),
    )


class DentalLabAdmin(admin.ModelAdmin):
    list_display = ("labName", "labPhone")
    search_fields = ("labName", "labPhone", "labAddress")
    ordering = ("labName",)

    fieldsets = (
        (
            "Dental Lab",
            {"fields": ("labName", "labPhone", "labAddress")},
        ),
    )


class PaymentAdmin(admin.ModelAdmin):
    list_display = ("paymentPlan", "paymentAmount", "paymentMethod", "paymentDateTime")
    list_filter = ("paymentDateTime", "paymentMethod")
    search_fields = (
        "paymentPlan__planPatient__patientName",
        "paymentPlan__planPatient__patientLastName",
    )
    ordering = ("-paymentDateTime",)

    fieldsets = (
        ("Payment", {"fields": ("paymentPlan", "paymentAmount", "paymentMethod")}),
        ("Record", {"fields": ("paymentDateTime",), "classes": ("collapse",)}),
    )
    readonly_fields = ("paymentDateTime",)


admin.site.register(Material, MaterialAdmin)
admin.site.register(DentalLab, DentalLabAdmin)
admin.site.register(Payment, PaymentAdmin)
