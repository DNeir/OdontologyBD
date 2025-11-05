from django.db import models

# Create your models here.


class Dentist(models.Model):
    nombreDentist = models.CharField(
        max_length=100, help_text="Ingrese el nombre del dentista"
    )
    apellidoDentist = models.CharField(
        max_length=100, help_text="Ingrese los apellidos del dentista"
    )
    especialidadDentist = models.CharField(
        max_length=100, blank=True, null=True, help_text="Especialidad del dentista"
    )

    def __str__(self):
        return f"{self.nombreDentist} {self.apellidoDentist}"

    class Meta:
        verbose_name = "dentista"
        verbose_name_plural = "dentistas"


class Tooth(models.Model):
    numeroTooth = models.CharField(
        max_length=10, help_text="Número o código del diente"
    )
    descripcionTooth = models.TextField(
        blank=True, null=True, help_text="Descripción del diente"
    )

    def __str__(self):
        return f"Diente {self.numeroTooth}"

    class Meta:
        verbose_name = "diente"
        verbose_name_plural = "dientes"


class Treatment(models.Model):
    nombreTreatment = models.CharField(
        max_length=100, help_text="Nombre del tratamiento"
    )
    descripcionTreatment = models.TextField(
        blank=True, null=True, help_text="Descripción del tratamiento"
    )
    costoTreatment = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Costo del tratamiento",
    )

    def __str__(self):
        return f"{self.nombreTreatment}"

    class Meta:
        verbose_name = "tratamiento"
        verbose_name_plural = "tratamientos"


class TreatmentPlan(models.Model):
    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    ]

    pacientePlan = models.ForeignKey(
        "patients.Patient",
        on_delete=models.CASCADE,
        related_name="treatment_plans",
        help_text="Seleccione el paciente",
    )
    dentistaPlan = models.ForeignKey(
        Dentist,
        on_delete=models.CASCADE,
        related_name="treatment_plans",
        help_text="Seleccione el dentista responsable",
    )
    fechaInicioPlan = models.DateField(help_text="Fecha de inicio del plan")
    fechaFinPlan = models.DateField(
        blank=True, null=True, help_text="Fecha de fin prevista (opcional)"
    )
    estadoPlan = models.CharField(
        max_length=8,
        choices=STATUS_CHOICES,
        default="ACTIVE",
        help_text="Estado actual del plan",
    )

    def __str__(self):
        return f"Plan {self.id} - {self.pacientePlan}"

    class Meta:
        verbose_name = "plan de tratamiento"
        verbose_name_plural = "planes de tratamiento"


class Procedure(models.Model):
    planProcedure = models.ForeignKey(
        TreatmentPlan,
        on_delete=models.CASCADE,
        related_name="procedures",
        help_text="Plan de tratamiento al que pertenece",
    )
    tratamientoProcedure = models.ForeignKey(
        Treatment,
        on_delete=models.CASCADE,
        related_name="procedures",
        help_text="Tratamiento realizado",
    )
    dienteProcedure = models.ForeignKey(
        Tooth,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="procedures",
        help_text="Diente intervenido (opcional)",
    )
    fechaProcedure = models.DateField(
        help_text="Fecha en que se realizó el procedimiento"
    )
    observacionesProcedure = models.TextField(
        blank=True, null=True, help_text="Observaciones adicionales"
    )

    def __str__(self):
        return f"{self.tratamientoProcedure} ({self.fechaProcedure})"

    class Meta:
        verbose_name = "procedimiento"
        verbose_name_plural = "procedimientos"


class TreatmentMaterial(models.Model):
    tratamientoTm = models.ForeignKey(
        Treatment,
        on_delete=models.CASCADE,
        related_name="materiales_usados",
        help_text="Tratamiento que utiliza el material",
    )
    materialTm = models.ForeignKey(
        "inventory.Material",
        on_delete=models.CASCADE,
        related_name="tratamientos",
        help_text="Material empleado",
    )
    cantidadTm = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Cantidad utilizada"
    )

    def __str__(self):
        return f"{self.cantidadTm} de {self.materialTm} en {self.tratamientoTm}"

    class Meta:
        verbose_name = "material por tratamiento"
        verbose_name_plural = "materiales por tratamiento"
        unique_together = ("tratamientoTm", "materialTm")
