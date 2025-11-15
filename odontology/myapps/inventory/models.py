from django.db import models

# Create your models here.


class Material(models.Model):
    materialName = models.CharField(
        max_length=100, help_text="Material name", null=True
    )
    materialDescription = models.TextField(
        blank=True, null=True, help_text="Material description"
    )
    materialStock = models.IntegerField(default=0, help_text="Stock quantity")

    def __str__(self):
        return f"{self.materialName}"

    class Meta:
        verbose_name = "material"
        verbose_name_plural = "materials"


class DentalLab(models.Model):
    labName = models.CharField(
        max_length=100, help_text="Dental laboratory name", null=True
    )
    labPhone = models.CharField(
        max_length=20, blank=True, null=True, help_text="Contact phone"
    )
    labAddress = models.TextField(blank=True, null=True, help_text="Laboratory address")

    def __str__(self):
        return f"{self.labName}"

    class Meta:
        verbose_name = "dental lab"
        verbose_name_plural = "dental labs"


class Payment(models.Model):
    paymentPlan = models.ForeignKey(
        "clinic.TreatmentPlan",
        on_delete=models.CASCADE,
        related_name="payments",
        help_text="Treatment plan associated with the payment",
    )
    paymentDateTime = models.DateTimeField(
        auto_now_add=True, help_text="Date and time the payment was recorded"
    )
    paymentAmount = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Amount paid"
    )
    paymentMethod = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Payment method (cash, card, transfer...)",
    )

    def __str__(self):
        return f"Payment {self.paymentAmount} ({self.paymentDateTime:%d/%m/%Y %H:%M})"

    class Meta:
        verbose_name = "payment"
        verbose_name_plural = "payments"
