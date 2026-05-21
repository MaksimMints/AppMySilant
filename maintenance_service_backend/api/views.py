from rest_framework import viewsets, status
from .serializers import \
    MachineSerializer, TmSerializer, ClaimsSerializer, CustomerNameSerializer, ServiceCompanyNameSerializer, \
    MachineCreateSerializer, CompaniesTMSerializer, ModelMachinesSerializer, \
    ModelEnginedSerializer, TransmissionSerializer, DrivingBridgeSerializer, ControlledBridgeSerializer, \
    TmSerializer, TmCreateSerializer, TypeOfTechnicalMaintenanceSerializer, CompaniesTMSerializer, \
    ClaimSerializer, ClaimCreateSerializer, ComponentsMachineSerializer, RecoveryMethodsSerializer
from maintenance_service.models import \
    Machine, TechnicalMaintenance, Claims, Customers, ServiceCompanies, CustomerProxy, ServiceCompanyProxy, \
    ModelMachines, ModelEngined, Transmission, DrivingBridge, ControlledBridge, TypeOfTechnicalMaintenance, \
    CompaniesTM, ComponentsMachine, RecoveryMethods
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet


# class IsManagerForCreate(BasePermission):
#     def has_permission(self, request, view):
#         if view.action != 'create':
#             return True
#
#         return request.user and request.user.groups.filter(name='Manager').exists()

class MachineViewSet(ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):

        if self.action in ['create', 'update', 'partial_update']:
            return MachineCreateSerializer
        return MachineSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        serial = self.request.query_params.get('serial_number_machine')
        if serial:
            qs = qs.filter(serial_number_machine=serial)
            return qs

        user = self.request.user
        if not user or not user.is_authenticated:
            return Machine.objects.none()

        if user.groups.filter(name='Manager').exists() or user.is_staff or user.is_superuser:
            return qs

        qs_customer = Machine.objects.filter(customer=user)
        if user.groups.filter(name='Customer').exists():
            return qs_customer

        qs_service = Machine.objects.filter(service_company=user)
        if user.groups.filter(name='ServiceCompany').exists():
            return qs_service

        return Machine.objects.none()
    # def get_permissions(self):
    #     if self.action == 'create':
    #         return [IsAuthenticated(), IsManagerForCreate()]
    #     return [IsAuthenticated()]

    def perform_create(self, serializer):

        serializer.save()


class ClaimsViewSet(viewsets.ModelViewSet):
    queryset = Claims.objects.all()
    serializer_class = ClaimsSerializer


class CustomerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Customers.objects.all()
    serializer_class = CustomerNameSerializer
    permission_classes = [IsAuthenticated]


class ServiceCompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCompanies.objects.all()
    serializer_class = ServiceCompanyNameSerializer
    permission_classes = [IsAuthenticated]

#@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'ok': True, 'user': {'id': user.id, 'username': user.username}})
    return Response({'ok': False}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    groups = list(user.groups.values_list('name', flat=True))
    is_manager = user.groups.filter(name='Manager').exists()
    return JsonResponse({
                            'id': user.id,
                            'username': user.username,
                            'groups': groups,
                            'is_manager': is_manager,
                        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def data_view(request):
    machines = Machine.objects.all()
    serializer = MachineSerializer(machines, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response({'ok': True})

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    token = get_token(request) # фактический CSRF токен
    return Response({'csrf_token': token})

@api_view(['GET'])
def machine_by_serial(request):
    sn = request.query_params.get('serial_number_machine')
    if not sn:
        return Response({'detail': 'serial_number_machine is required'}, status=status.HTTP_400_BAD_REQUEST)
    machine = get_object_or_404(Machine, serial_number_machine=sn)
    serializer = MachineSerializer(machine)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customers_list(request):
    customers = Customers.objects.all()
    serializer = CustomerNameSerializer(customers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def service_companies_list(request):
    companies = ServiceCompanies.objects.all()
    serializer = ServiceCompanyNameSerializer(companies, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customers_for_dropdown(request):

    from django.contrib.auth import get_user_model
    User = get_user_model()

    customers = User.objects.filter(groups__name='Customer').values('id', 'username', 'first_name', 'last_name')

    result = [
        {
            'id': c['id'],
            'name': f"{c['first_name']} {c['last_name']}" if c['first_name'] or c['last_name'] else c['username']
        }
        for c in customers
    ]

    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def service_companies_for_dropdown(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()

    companies = User.objects.filter(groups__name='ServiceCompany').values('id', 'username', 'first_name', 'last_name')

    result = [
        {
            'id': c['id'],
            'name': f"{c['first_name']} {c['last_name']}" if c['first_name'] or c['last_name'] else c['username']
        }
        for c in companies
    ]

    return Response(result)

class ModelMachinesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ModelMachines.objects.all()
    serializer_class = ModelMachinesSerializer
    permission_classes = [IsAuthenticated]


class ModelEnginedViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ModelEngined.objects.all()
    serializer_class = ModelEnginedSerializer
    permission_classes = [IsAuthenticated]


class TransmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transmission.objects.all()
    serializer_class = TransmissionSerializer
    permission_classes = [IsAuthenticated]


class DrivingBridgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DrivingBridge.objects.all()
    serializer_class = DrivingBridgeSerializer
    permission_classes = [IsAuthenticated]


class ControlledBridgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ControlledBridge.objects.all()
    serializer_class = ControlledBridgeSerializer
    permission_classes = [IsAuthenticated]


class TmViewSet(viewsets.ModelViewSet):
    queryset = TechnicalMaintenance.objects.all()
    serializer_class = TmSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TmCreateSerializer
        return TmSerializer


class TypeOfTechnicalMaintenanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TypeOfTechnicalMaintenance.objects.all()
    serializer_class = TypeOfTechnicalMaintenanceSerializer
    permission_classes = [IsAuthenticated]


class CompaniesTMViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CompaniesTM.objects.all()
    serializer_class = CompaniesTMSerializer
    permission_classes = [IsAuthenticated]


class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claims.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ClaimCreateSerializer
        return ClaimSerializer


class ComponentsMachineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ComponentsMachine.objects.all()
    serializer_class = ComponentsMachineSerializer
    permission_classes = [IsAuthenticated]


class RecoveryMethodsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RecoveryMethods.objects.all()
    serializer_class = RecoveryMethodsSerializer
    permission_classes = [IsAuthenticated]