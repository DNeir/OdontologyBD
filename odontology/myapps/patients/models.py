# Create your models here.
from django.core.validators import RegexValidator
from django.db import models


class Patient(models.Model):
    patientName = models.CharField(
        max_length=100, help_text="Enter patient's first name"
    )
    patientLastName = models.CharField(
        max_length=100, help_text="Enter patient's last name"
    )
    patientBirthDate = models.DateField(
        blank=True, null=True, help_text="Enter patient's birth date"
    )
    patientPhone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[RegexValidator(r"^\+?1?\d{7,15}$", "Invalid phone number.")],
        help_text="Enter patient's phone number",
    )
    patientAddress = models.TextField(
        blank=True, null=True, help_text="Enter patient's address"
    )

    def __str__(self):
        return f"{self.patientName} {self.patientLastName}"

    class Meta:
        verbose_name = "patient"
        verbose_name_plural = "patients"


class DentalHistory(models.Model):
    historyPatient = models.OneToOneField(
        Patient,
        on_delete=models.CASCADE,
        related_name="dental_history",
        help_text="Select the patient this record belongs to",
    )
    historyAnamnesis = models.TextField(
        blank=True, null=True, help_text="Enter patient anamnesis"
    )

    def __str__(self):
        return f"History for {self.historyPatient}"

    class Meta:
        verbose_name = "dental history"
        verbose_name_plural = "dental histories"


class Appointment(models.Model):
    appointmentPatient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments",
        help_text="Select appointment patient",
    )
    appointmentDentist = models.ForeignKey(
        "clinic.Dentist",
        on_delete=models.CASCADE,
        related_name="appointments",
        help_text="Select appointment dentist",
    )
    appointmentDateTime = models.DateTimeField(
        help_text="Enter appointment date and time"
    )
    appointmentReason = models.TextField(
        blank=True, null=True, help_text="Enter reason for appointment"
    )

    def __str__(self):
        return (
            f"Appointment for {self.appointmentPatient} on {self.appointmentDateTime}"
        )

    class Meta:
        verbose_name = "appointment"
        verbose_name_plural = "appointments"
