from rest_framework import routers
from django.urls import path, include
from .views import \
    MachineViewSet, CustomerViewSet, ServiceCompanyViewSet, login_view, me_view, data_view, logout_view, \
    TmViewSet, ClaimsViewSet, ModelMachinesViewSet, ModelEnginedViewSet, TransmissionViewSet, \
    DrivingBridgeViewSet, ControlledBridgeViewSet, TypeOfTechnicalMaintenanceViewSet, CompaniesTMViewSet, \
    ClaimViewSet, ComponentsMachineViewSet, RecoveryMethodsViewSet
from . import views

router = routers.DefaultRouter()
router.register(r'machines', MachineViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'service_companies', ServiceCompanyViewSet)
router.register(r'tm', TmViewSet)
router.register(r'claims', ClaimsViewSet)
router.register(r'model_machines', ModelMachinesViewSet)
router.register(r'model_engines', ModelEnginedViewSet)
router.register(r'transmissions', TransmissionViewSet)
router.register(r'driving_bridges', DrivingBridgeViewSet)
router.register(r'controlled_bridges', ControlledBridgeViewSet)
router.register(r'types_of_tm', TypeOfTechnicalMaintenanceViewSet)
router.register(r'companies_tm', CompaniesTMViewSet)
router.register(r'components', ComponentsMachineViewSet)
router.register(r'recovery_methods', RecoveryMethodsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
    path('me/', me_view, name='me'),
    path('data/', data_view, name='data'),
    path('logout/', logout_view, name='logout'),
    path('get_csrf_token/', views.get_csrf_token, name='get_csrf_token'),
    path('customers_dropdown/', views.customers_for_dropdown, name='customers_dropdown'),
    path('service_companies_dropdown/', views.service_companies_for_dropdown, name='service_companies_dropdown'),

]

