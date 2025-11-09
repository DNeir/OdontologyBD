from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import DentalLab, Material, Payment
from .serializers import DentalLabSerializer, MaterialSerializer, PaymentSerializer


class DentalLabListCreateView(ListCreateAPIView):
    queryset = DentalLab.objects.all()
    serializer_class = DentalLabSerializer


class DentalLabRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = DentalLab.objects.all()
    serializer_class = DentalLabSerializer


class MaterialListCreateView(ListCreateAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class MaterialRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class PaymentListCreateView(ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class PaymentRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
