from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_personal_admin(apps, schema_editor):
    CustomUser = apps.get_model('users', 'CustomUser')
    if not CustomUser.objects.filter(username='personal_admin').exists():
        CustomUser.objects.create(
            username='personal_admin',
            password=make_password('senha123'),
            is_personal=True,
            is_staff=True,
            is_superuser=True,
        )

def remove_personal_admin(apps, schema_editor):
    CustomUser = apps.get_model('users', 'CustomUser')
    CustomUser.objects.filter(username='personal_admin').delete()

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_personal_admin, remove_personal_admin),
    ]
