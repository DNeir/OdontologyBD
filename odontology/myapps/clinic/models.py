from django.db import models

# Create your models here.


class Dentist(models.Model):
    dentistName = models.CharField(max_length=100, help_text="Enter the dentist's name")
    dentistLastName = models.CharField(
        max_length=100, help_text="Enter the dentist's last name"
    )
    dentistSpecialty = models.CharField(
        max_length=100, blank=True, null=True, help_text="Dentist's specialty"
    )

    def __str__(self):
        return f"{self.dentistName} {self.dentistLastName}"

    class Meta:
        verbose_name = "dentist"
        verbose_name_plural = "dentists"


class Tooth(models.Model):
    toothNumber = models.CharField(max_length=10, help_text="Tooth number or code")
    toothDescription = models.TextField(
        blank=True, null=True, help_text="Tooth description"
    )

    def __str__(self):
        return f"Tooth {self.toothNumber}"

    class Meta:
        verbose_name = "tooth"
        verbose_name_plural = "teeth"


class Treatment(models.Model):
    treatmentName = models.CharField(max_length=100, help_text="Treatment name")
    treatmentDescription = models.TextField(
        blank=True, null=True, help_text="Treatment description"
    )
    treatmentCost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Treatment cost",
    )

    def __str__(self):
        return f"{self.treatmentName}"

    class Meta:
        verbose_name = "treatment"
        verbose_name_plural = "treatments"


class TreatmentPlan(models.Model):
    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    ]

    planPatient = models.ForeignKey(
        "patients.Patient",
        on_delete=models.CASCADE,
        related_name="treatment_plans",
        help_text="Select the patient",
    )
    planDentist = models.ForeignKey(
        Dentist,
        on_delete=models.CASCADE,
        related_name="treatment_plans",
        help_text="Select the responsible dentist",
    )
    planStartDate = models.DateField(help_text="Plan start date")
    planEndDate = models.DateField(
        blank=True, null=True, help_text="Expected end date (optional)"
    )
    planStatus = models.CharField(
        max_length=8,
        choices=STATUS_CHOICES,
        default="ACTIVE",
        help_text="Current plan status",
    )

    def __str__(self):
        return f"Plan {self.id} - {self.planPatient}"

    class Meta:
        verbose_name = "treatment plan"
        verbose_name_plural = "treatment plans"


class Procedure(models.Model):
    procedurePlan = models.ForeignKey(
        TreatmentPlan,
        on_delete=models.CASCADE,
        related_name="procedures",
        help_text="Treatment plan this procedure belongs to",
    )
    procedureTreatment = models.ForeignKey(
        Treatment,
        on_delete=models.CASCADE,
        related_name="procedures",
        help_text="Treatment performed",
    )
    procedureTooth = models.ForeignKey(
        Tooth,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="procedures",
        help_text="Tooth involved (optional)",
    )
    procedureDate = models.DateField(help_text="Date the procedure was performed")
    procedureNotes = models.TextField(
        blank=True, null=True, help_text="Additional notes"
    )

    def __str__(self):
        return f"{self.procedureTreatment} ({self.procedureDate})"

    class Meta:
        verbose_name = "procedure"
        verbose_name_plural = "procedures"


class TreatmentMaterial(models.Model):
    tmTreatment = models.ForeignKey(
        Treatment,
        on_delete=models.CASCADE,
        related_name="materiales_usados",
        help_text="Treatment that uses the material",
    )
    tmMaterial = models.ForeignKey(
        "inventory.Material",
        on_delete=models.CASCADE,
        related_name="tratamientos",
        help_text="Material used",
    )
    tmQuantity = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Quantity used"
    )

    def __str__(self):
        return f"{self.tmQuantity} of {self.tmMaterial} in {self.tmTreatment}"

    class Meta:
        verbose_name = "treatment material"
        verbose_name_plural = "treatment materials"
        unique_together = ("tmTreatment", "tmMaterial")
