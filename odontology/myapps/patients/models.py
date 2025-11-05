# Create your models here.
# from django.db import models
from django.core.validators import RegexValidator
from django.db import models


class Patient(models.Model):
    nombrePatient = models.CharField(
        max_length=100, help_text="Ingrese el nombre del paciente"
    )
    apellidoPatient = models.CharField(
        max_length=100, help_text="Ingrese los apellidos del paciente"
    )
    fechaNacimientoPatient = models.DateField(
        blank=True, null=True, help_text="Ingrese la fecha de nacimiento del paciente"
    )
    telefonoPatient = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[RegexValidator(r"^\+?1?\d{7,15}$", "Teléfono inválido.")],
        help_text="Ingrese el teléfono del paciente",
    )
    direccionPatient = models.TextField(
        blank=True, null=True, help_text="Ingrese la dirección del paciente"
    )

    def __str__(self):
        return f"{self.nombrePatient} {self.apellidoPatient}"

    class Meta:
        verbose_name = "paciente"
        verbose_name_plural = "pacientes"


class DentalHistory(models.Model):
    pacienteHistory = models.OneToOneField(
        Patient,
        on_delete=models.CASCADE,
        related_name="dental_history",
        help_text="Seleccione el paciente al que pertenece esta historia",
    )
    anamnesisHistory = models.TextField(
        blank=True, null=True, help_text="Ingrese la anamnesis del paciente"
    )

    def __str__(self):
        return f"Historia de {self.pacienteHistory}"

    class Meta:
        verbose_name = "historia dental"
        verbose_name_plural = "historias dentales"


class Appointment(models.Model):
    pacienteAppointment = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments",
        help_text="Seleccione el paciente de la cita",
    )
    dentistaAppointment = models.ForeignKey(
        "clinic.Dentist",  # cambia el nombre de la app si usas otro
        on_delete=models.CASCADE,
        related_name="appointments",
        help_text="Seleccione el dentista de la cita",
    )
    fechaHoraAppointment = models.DateTimeField(
        help_text="Ingrese la fecha y hora de la cita"
    )
    motivoAppointment = models.TextField(
        blank=True, null=True, help_text="Ingrese el motivo o razón de la cita"
    )

    def __str__(self):
        return f"Cita de {self.pacienteAppointment} el {self.fechaHoraAppointment}"

    class Meta:
        verbose_name = "cita"
        verbose_name_plural = "citas"
