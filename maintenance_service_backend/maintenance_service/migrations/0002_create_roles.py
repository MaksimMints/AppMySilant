from django.db import migrations

def create_roles_permissions(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Permission = apps.get_model('auth', 'Permission')
    ContentType = apps.get_model('contenttypes', 'ContentType')

    Machine = apps.get_model('maintenance_service', 'Machine')
    TM = apps.get_model('maintenance_service', 'TechnicalMaintenance')
    Claims = apps.get_model('maintenance_service', 'Claims')


    for name in ['Guest', 'Customer', 'ServiceCompany', 'Manager']:
        Group.objects.get_or_create(name=name)

    ct_machine = ContentType.objects.get_for_model(Machine)
    ct_tm = ContentType.objects.get_for_model(TM)
    ct_claim = ContentType.objects.get_for_model(Claims)

    perms = [
        ('view_machine', 'Can view machine', ct_machine),
        ('add_machine', 'Can add machine', ct_machine),
        ('change_machine', 'Can change machine', ct_machine),

        ('view_to', 'Can view technical maintenance', ct_tm),
        ('add_to', 'Can add technical maintenance', ct_tm),
        ('change_to', 'Can change technical maintenance', ct_tm),

        ('view_claim', 'Can view claim', ct_claim),
        ('add_claim', 'Can add claim', ct_claim),
        ('change_claim', 'Can change claim', ct_claim),
    ]

    perm_map = {}
    for codename, name, ctype in perms:
        perm, _ = Permission.objects.get_or_create(codename=codename, name=name, content_type=ctype)
        perm_map[codename] = perm

    groups_map = {
        'Guest': ['view_machine'],
        'Customer': ['view_machine', 'add_machine'],
        'ServiceCompany': ['view_machine', 'add_machine', 'view_to', 'add_to', 'view_claim', 'add_claim'],
        'Manager': list(perm_map.keys()),
    }

    for group_name, cods in groups_map.items():
        group = Group.objects.get(name=group_name)
        for cod in cods:
            perm = perm_map[cod]
            if not group.permissions.filter(id=perm.id).exists():
                group.permissions.add(perm)

class Migration(migrations.Migration):
    dependencies = [('maintenance_service', '0001_initial'),]
    operations = [migrations.RunPython(create_roles_permissions),]