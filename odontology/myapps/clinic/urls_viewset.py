from rest_framework.routers import DefaultRouter

from .views_viewset import (
    DentistViewSet,
    ProcedureViewSet,
    ToothViewSet,
    TreatmentMaterialViewSet,
    TreatmentPlanViewSet,
    TreatmentViewSet,
)

router = DefaultRouter()
router.register(r"dentists", DentistViewSet)
router.register(r"procedures", ProcedureViewSet)
router.register(r"tooths", ToothViewSet)
router.register(r"treatment_materials", TreatmentMaterialViewSet)
router.register(r"treatment_plans", TreatmentPlanViewSet)
router.register(r"treatments", TreatmentViewSet)

urlpatterns = router.urls
