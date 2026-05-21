from django.db import models
from datetime import date, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model

class ModelMachines(models.Model):
    name_model_machine = models.CharField("Модель машины", max_length=100)
    description_model_machine = models.CharField("Описание машины", max_length=250, blank=True)
    
    def __str__(self):
        return f"{self.name_model_machine} ({self.description_model_machine})"

class ModelEngined(models.Model):
    name_model_engine = models.CharField("Модель двигателя", max_length=100)
    description_model_engine = models.CharField("Описание двигателя", max_length=250, blank=True)

    def __str__(self):
        return f"{self.name_model_engine} ({self.description_model_engine})"

class Transmission(models.Model):
    name_transmission = models.CharField("Модель трансмиссии", max_length=100)
    description_transmission = models.CharField("Описание трансмиссии", max_length=250, blank=True)

    def __str__(self):
        return f"{self.name_transmission} ({self.description_transmission})"

class DrivingBridge(models.Model):
    name_driving_bridge = models.CharField("Модель ведущего моста", max_length=100)
    description_driving_bridge = models.CharField("Оисание ведущего моста", max_length=250, blank=True)

    def __str__(self):
        return f"{self.name_driving_bridge} ({self.description_driving_bridge})"

class ControlledBridge(models.Model):
    name_controlled_bridge = models.CharField("Модель управляемого моста", max_length=100)
    description_controlled_bridge = models.CharField("Описание управляемого моста", max_length=250, blank=True)

    def __str__(self):
        return f"{self.name_controlled_bridge} ({self.description_controlled_bridge})"

class Customers(models.Model):
    name_customer = models.CharField("Клиент", max_length=100, unique=True)

    def __str__(self):
        return f"{self.name_customer}"

class ServiceCompanies(models.Model):
    name_service_company = models.CharField("Сервисная компания", max_length=100, unique=True)

    def __str__(self):
        return f"{self.name_service_company}"

class TypeOfTechnicalMaintenance(models.Model):
    name_type_of_TM = models.CharField("Вид ТО", max_length=100, unique=True)

    def __str__(self):
        return f"{self.name_type_of_TM}"

class CompaniesTM(models.Model):
    name_companyTM = models.CharField("Компания, проводящая ТО", max_length=100)

    def __str__(self):
        return f"{self.name_companyTM}"

class ComponentsMachine(models.Model):
    name_component = models.CharField("Узел машины", max_length=100)

    def __str__(self):
        return f"{self.name_component}"

class RecoveryMethods(models.Model):
    name_recovery_method = models.CharField("Способ восстановления", max_length=100)

    def __str__(self):
        return f"{self.name_recovery_method}"

class Machine(models.Model):
    serial_number_machine = models.CharField("Серийный номер машины", max_length=100, unique=True)
    model_machine = models.ForeignKey(
        'maintenance_service.ModelMachines',
        on_delete=models.CASCADE,
        verbose_name="Модель машины",
        related_name='machines'
    )
    model_engine = models.ForeignKey(
        'maintenance_service.ModelEngined',
        on_delete=models.CASCADE,
        verbose_name="Модель двигателя",
        related_name='engines'
    )
    serial_number_engine = models.CharField("Серийный номер двигателя", max_length=100, unique=True)
    model_transmission = models.ForeignKey(
        'maintenance_service.Transmission',
        on_delete=models.CASCADE,
        verbose_name="Модель трансмиссии",
        related_name='transmissions'
    )
    serial_number_transmission = models.CharField("Серийный номер трансмиссии", max_length=100, unique=True)
    model_driving_bridge = models.ForeignKey(
        'maintenance_service.DrivingBridge',
        on_delete=models.CASCADE,
        verbose_name="Ведущий мост",
        related_name='driving_bridges'
    )
    serial_number_driving_bridge = models.CharField("Серийный номер ведущего моста", max_length=100, unique=True)
    model_controlled_bridge = models.ForeignKey(
        'maintenance_service.ControlledBridge',
        on_delete=models.CASCADE,
        verbose_name="Управляемый мост",
        related_name='controlled_bridges'
    )
    serial_number_controlled_bridge = models.CharField("Серийный номер управляемого моста", max_length=100,
                                                       unique=True)
    supply_contract_number_and_date = models.CharField("Договор поставки номер и дата", max_length=100, unique=True)
    date_shipment_from_factory = models.DateField("Дата отгрузки с завода")
    recipient = models.CharField("Получатель", max_length=100)
    operating_address = models.CharField("Эксплуатационный адрес", max_length=250)
    equipment = models.CharField("Комплектация", max_length=250)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Клиент",
                                 related_name='customer')
    service_company = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                        verbose_name="Сервисная компания", related_name='service_company')

    def __str__(self):
        return f"Машина {self.model_machine} SN: {self.serial_number_machine}"

class TechnicalMaintenance(models.Model):
    serial_number_machine = models.ForeignKey(
        'maintenance_service.Machine',
        on_delete=models.CASCADE,
        verbose_name="Зав. номер машины",
        related_name="maintenance_sn_machine"
    )
    type_of_tm = models.ForeignKey(
        'maintenance_service.TypeOfTechnicalMaintenance',
        on_delete=models.CASCADE,
        verbose_name="Вид ТО",
        related_name="maintenance_types"
    )
    date_tm = models.DateField("Дата проведения ТО")
    operating_time = models.IntegerField("Наработка")
    number_orderoutfit = models.CharField("Номер заказ-наряда", max_length=100, unique=True)
    date_orderoutfit = models.DateField("Дата заказ-наряда")
    tm_company = models.ForeignKey(
        'maintenance_service.CompaniesTM',
        on_delete=models.CASCADE,
        verbose_name="Компания, проводившая ТО",
        related_name="maintenance_companies"
    )
    service_company = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # ← ИЗМЕНИТЬ: теперь ссылается на User
        on_delete=models.CASCADE,
        verbose_name="Сервисная компания",
        related_name='maintenance_service_companies',
        limit_choices_to={'groups__name': 'ServiceCompany'}
    )

    def __str__(self):
        return f"ТО: {self.serial_number_machine.serial_number_machine} - {self.type_of_tm} от {self.date_tm}"

    @property
    def model_machine(self):

        return self.serial_number_machine.model_machine


class Claims(models.Model):
    serial_number_machine = models.ForeignKey(
        'maintenance_service.Machine',
        on_delete=models.CASCADE,
        verbose_name="Зав. номер машины",
        related_name="claims_sn_machine"
    )
    date_failure = models.DateField("Дата отказа")
    claim_operating_time = models.IntegerField("Наработка в момент обращения (м.ч.)")
    component_failure = models.ForeignKey(
        'maintenance_service.ComponentsMachine',
        on_delete=models.CASCADE,
        verbose_name="Узел отказа",
        related_name="claims_components"
    )
    description_failure = models.TextField("Описание отказа")
    recovery_method = models.ForeignKey(
        'maintenance_service.RecoveryMethods',
        on_delete=models.CASCADE,
        verbose_name="Способ восстановления",
        related_name="claims_methods"
    )
    spare_parts = models.CharField("Используемые запасные части", max_length=250)
    date_recovery = models.DateField("Дата восстановления")
    equipment_downtime = models.IntegerField("Время простоя (дни)", null=True, blank=True)
    # УДАЛИЛИ поле machine - оно дублирует serial_number_machine
    service_company = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # ИЗМЕНИЛИ: теперь ссылается на User
        on_delete=models.CASCADE,
        verbose_name="Сервисная компания",
        related_name='claims_service_companies',
        limit_choices_to={'groups__name': 'ServiceCompany'}
    )

    def save(self, *args, **kwargs):
        if self.date_recovery and self.date_failure:
            delta = self.date_recovery - self.date_failure
            self.equipment_downtime = delta.days
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Рекламация: {self.serial_number_machine.serial_number_machine} от {self.date_failure}"

    @property
    def model_machine(self):
        """Автоматически получает модель машины через serial_number_machine"""
        return self.serial_number_machine.model_machine

UserModel = get_user_model()

class CustomerProxy(UserModel):

    class Meta:
        proxy = True
        app_label = 'maintenance_service'
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'

class ServiceCompanyProxy(UserModel):
    class Meta:
        proxy = True
        app_label = 'maintenance_service'
        verbose_name = 'Service Company'
        verbose_name_plural = 'Service Companies'