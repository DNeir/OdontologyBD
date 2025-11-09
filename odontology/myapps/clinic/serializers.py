from rest_framework import serializers

from .models import (
    Dentist,
    Procedure,
    Tooth,
    Treatment,
    TreatmentMaterial,
    TreatmentPlan,
)


class DentistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dentist
        fields = "__all__"


class ProcedureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedure
        fields = "__all__"


class ToothSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tooth
        fields = "__all__"


class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = "__all__"


class TreatmentMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentMaterial
        fields = "__all__"


class TreatmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreatmentPlan
        fields = "__all__"
