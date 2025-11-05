from django.db import models

# Create your models here.


class Material(models.Model):
    nombreMaterial = models.CharField(max_length=100, help_text="Nombre del material")
    descripcionMaterial = models.TextField(
        blank=True, null=True, help_text="Descripción del material"
    )
    stockMaterial = models.IntegerField(default=0, help_text="Cantidad en inventario")

    def __str__(self):
        return f"{self.nombreMaterial}"

    class Meta:
        verbose_name = "material"
        verbose_name_plural = "materiales"


class DentalLab(models.Model):
    nombreLab = models.CharField(
        max_length=100, help_text="Nombre del laboratorio dental"
    )
    telefonoLab = models.CharField(
        max_length=20, blank=True, null=True, help_text="Teléfono de contacto"
    )
    direccionLab = models.TextField(
        blank=True, null=True, help_text="Dirección del laboratorio"
    )

    def __str__(self):
        return f"{self.nombreLab}"

    class Meta:
        verbose_name = "laboratorio dental"
        verbose_name_plural = "laboratorios dentales"


class Payment(models.Model):
    planPayment = models.ForeignKey(
        "clinic.TreatmentPlan",
        on_delete=models.CASCADE,
        related_name="payments",
        help_text="Plan de tratamiento al que se asocia el pago",
    )
    fechaHoraPayment = models.DateTimeField(
        auto_now_add=True, help_text="Fecha y hora en que se registró el pago"
    )
    montoPayment = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Monto pagado"
    )
    metodoPayment = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Método de pago (efectivo, tarjeta, transferencia...)",
    )

    def __str__(self):
        return f"Pago {self.montoPayment} ({self.fechaHoraPayment:%d/%m/%Y %H:%M})"

    class Meta:
        verbose_name = "pago"
        verbose_name_plural = "pagos"
