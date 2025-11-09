from rest_framework import serializers

from .models import DentalLab, Material, Payment


class DentalLabSerializer(serializers.ModelSerializer):
    class Meta:
        model = DentalLab
        fields = "__all__"


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
