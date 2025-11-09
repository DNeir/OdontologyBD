from rest_framework import serializers

from .models import Appointment, DentalHistory, Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"


class DentalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DentalHistory
        fields = "__all__"
