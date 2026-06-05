from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'username', 'is_personal', 'is_aluno', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Role Flags', {'fields': ('is_personal', 'is_aluno')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
