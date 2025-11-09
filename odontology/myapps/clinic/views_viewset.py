from rest_framework import viewsets

from .models import (
    Dentist,
    Procedure,
    Tooth,
    Treatment,
    TreatmentMaterial,
    TreatmentPlan,
)
from .serializers import (
    DentistSerializer,
    ProcedureSerializer,
    ToothSerializer,
    TreatmentMaterialSerializer,
    TreatmentPlanSerializer,
    TreatmentSerializer,
)


class DentistViewSet(viewsets.ModelViewSet):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer


class ProcedureViewSet(viewsets.ModelViewSet):
    queryset = Procedure.objects.all()
    serializer_class = ProcedureSerializer


class ToothViewSet(viewsets.ModelViewSet):
    queryset = Tooth.objects.all()
    serializer_class = ToothSerializer


class TreatmentMaterialViewSet(viewsets.ModelViewSet):
    queryset = TreatmentMaterial.objects.all()
    serializer_class = TreatmentMaterialSerializer


class TreatmentPlanViewSet(viewsets.ModelViewSet):
    queryset = TreatmentPlan.objects.all()
    serializer_class = TreatmentPlanSerializer


class TreatmentViewSet(viewsets.ModelViewSet):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
