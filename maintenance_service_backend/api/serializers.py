from rest_framework import serializers
from django.contrib.auth import get_user_model
from maintenance_service.models import (
    Machine, TechnicalMaintenance, Claims,
    Customers, ServiceCompanies,
    CustomerProxy, ServiceCompanyProxy,
    ModelMachines, ModelEngined,
    Transmission, DrivingBridge, ControlledBridge,
    TypeOfTechnicalMaintenance, CompaniesTM, ComponentsMachine, RecoveryMethods
)

User = get_user_model()


class MachineSerializer(serializers.ModelSerializer):

    model_machine = serializers.StringRelatedField(read_only=True)
    model_engine = serializers.StringRelatedField(read_only=True)
    model_transmission = serializers.StringRelatedField(read_only=True)
    model_driving_bridge = serializers.StringRelatedField(read_only=True)
    model_controlled_bridge = serializers.StringRelatedField(read_only=True)
    customer = serializers.StringRelatedField(read_only=True)
    service_company = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Machine
        fields = '__all__'


class MachineCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Machine
        fields = '__all__'


class ClaimsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claims
        fields = '__all__'


class CustomerNameSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='username', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name']


class ServiceCompanyNameSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='username', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name']


class ModelMachinesSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_model_machine', read_only=True)

    class Meta:
        model = ModelMachines
        fields = ['id', 'name', 'name_model_machine', 'description_model_machine']


class ModelEnginedSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_model_engine', read_only=True)

    class Meta:
        model = ModelEngined
        fields = ['id', 'name', 'name_model_engine', 'description_model_engine']


class TransmissionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_transmission', read_only=True)

    class Meta:
        model = Transmission
        fields = ['id', 'name', 'name_transmission', 'description_transmission']


class DrivingBridgeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_driving_bridge', read_only=True)

    class Meta:
        model = DrivingBridge
        fields = ['id', 'name', 'name_driving_bridge', 'description_driving_bridge']


class ControlledBridgeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_controlled_bridge', read_only=True)

    class Meta:
        model = ControlledBridge
        fields = ['id', 'name', 'name_controlled_bridge', 'description_controlled_bridge']


class TmSerializer(serializers.ModelSerializer):
    serial_number_machine = serializers.StringRelatedField(read_only=True)
    type_of_tm = serializers.StringRelatedField(read_only=True)
    tm_company = serializers.StringRelatedField(read_only=True)
    service_company = serializers.StringRelatedField(read_only=True)

    model_machine = serializers.SerializerMethodField()

    class Meta:
        model = TechnicalMaintenance
        fields = '__all__'

    def get_model_machine(self, obj):
        return str(obj.serial_number_machine.model_machine) if obj.serial_number_machine else None


class TmCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = TechnicalMaintenance
        fields = [
            'serial_number_machine',
            'type_of_tm',
            'date_tm',
            'operating_time',
            'number_orderoutfit',
            'date_orderoutfit',
            'tm_company',
            'service_company',
        ]


class TypeOfTechnicalMaintenanceSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_type_of_TM', read_only=True)

    class Meta:
        model = TypeOfTechnicalMaintenance
        fields = ['id', 'name', 'name_type_of_TM']


class CompaniesTMSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_companyTM', read_only=True)

    class Meta:
        model = CompaniesTM
        fields = ['id', 'name', 'name_companyTM']


class ClaimSerializer(serializers.ModelSerializer):

    serial_number_machine = serializers.StringRelatedField(read_only=True)
    component_failure = serializers.StringRelatedField(read_only=True)
    recovery_method = serializers.StringRelatedField(read_only=True)
    service_company = serializers.StringRelatedField(read_only=True)

    model_machine = serializers.SerializerMethodField()

    class Meta:
        model = Claims
        fields = '__all__'

    def get_model_machine(self, obj):
        return str(obj.serial_number_machine.model_machine) if obj.serial_number_machine else None


class ClaimCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Claims
        fields = [
            'serial_number_machine',
            'date_failure',
            'claim_operating_time',
            'component_failure',
            'description_failure',
            'recovery_method',
            'spare_parts',
            'date_recovery',
            'service_company',
        ]


class ComponentsMachineSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_component', read_only=True)

    class Meta:
        model = ComponentsMachine
        fields = ['id', 'name', 'name_component']


class RecoveryMethodsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name_recovery_method', read_only=True)

    class Meta:
        model = RecoveryMethods
        fields = ['id', 'name', 'name_recovery_method']