from django.contrib import admin
from .models import Machine, ModelMachines, ModelEngined, Transmission, DrivingBridge, ControlledBridge, \
    CustomerProxy, ServiceCompanyProxy, ServiceCompanies, TypeOfTechnicalMaintenance, CompaniesTM, \
    ComponentsMachine, RecoveryMethods
from django.contrib.auth import get_user_model

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'customer':
            #kwargs['queryset'] = CustomerProxy.objects.filter(groups__name='Customer')
            kwargs['queryset'] = CustomerProxy.objects.all()
            #User = get_user_model()
            #kwargs['queryset'] = User.objects.filter(groups__name='Customer')
        elif db_field.name == 'service_company':
            #kwargs['queryset'] = ServiceCompanyProxy.objects.filter(groups__name='ServiceCompany')
            kwargs['queryset'] = ServiceCompanyProxy.objects.all()
            #User = get_user_model()
            #kwargs['queryset'] = User.objects.filter(groups__name='ServiceCompany')
        formfield = super().formfield_for_foreignkey(db_field, request, **kwargs)
        # отключаем Add внутри формы
        if getattr(formfield.widget, 'can_add_related', None):
            formfield.widget.can_add_related = False

        return formfield

@admin.register(CustomerProxy)
class CustomerProxyAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(groups__name='Customer')

@admin.register(ServiceCompanyProxy)
class ServiceCompanyProxyAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(groups__name='ServiceCompany')



class ModelMachineAdmin(admin.ModelAdmin):

    pass

class ModelEnginedAdmin(admin.ModelAdmin):

    pass

class TransmissionAdmin(admin.ModelAdmin):

    pass

class DrivingBridgeAdmin(admin.ModelAdmin):

    pass

class ControlledBridgeAdmin(admin.ModelAdmin):

    pass

#class CustomersAdmin(admin.ModelAdmin):

    #pass

#class ServiceCompaniesAdmin(admin.ModelAdmin):

    #pass

class TypeOfTmAdmin(admin.ModelAdmin):

    pass

class CompaniesTmAdmin(admin.ModelAdmin):

    pass

class ComponentsMachineAdmin(admin.ModelAdmin):

    pass

class RecoveryMethodsAdmin(admin.ModelAdmin):

    pass

admin.site.register(ModelMachines, ModelMachineAdmin)
admin.site.register(ModelEngined, ModelEnginedAdmin)
admin.site.register(Transmission,TransmissionAdmin)
admin.site.register(DrivingBridge, DrivingBridgeAdmin)
admin.site.register(ControlledBridge, ControlledBridgeAdmin)
admin.site.register(TypeOfTechnicalMaintenance, TypeOfTmAdmin)
admin.site.register(CompaniesTM, CompaniesTmAdmin)
#admin.site.register(Customers, CustomersAdmin)
#admin.site.register(ServiceCompanies, ServiceCompaniesAdmin)
admin.site.register(ComponentsMachine, ComponentsMachineAdmin)
admin.site.register(RecoveryMethods, RecoveryMethodsAdmin)
