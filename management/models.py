from django.db import models
from django.conf import settings

class ClientProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_profile')
    personal = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clients', limit_choices_to={'is_personal': True})
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF")
    address = models.CharField(max_length=255, verbose_name="Endereço")

    def __str__(self):
        return f"Perfil Aluno: {self.user.get_full_name() or self.user.username}"

    @property
    def cpf_formatted(self):
        if self.cpf and len(self.cpf) == 11:
            return f"{self.cpf[:3]}.{self.cpf[3:6]}.{self.cpf[6:9]}-{self.cpf[9:]}"
        return self.cpf


class WorkingHour(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Segunda-feira'),
        (1, 'Terça-feira'),
        (2, 'Quarta-feira'),
        (3, 'Quinta-feira'),
        (4, 'Sexta-feira'),
        (5, 'Sábado'),
        (6, 'Domingo'),
    ]
    personal = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='working_hours', limit_choices_to={'is_personal': True})
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK, verbose_name="Dia da Semana")
    start_time = models.TimeField(default='08:00', verbose_name="Horário de Início")
    end_time = models.TimeField(default='20:00', verbose_name="Horário de Fim")
    is_active = models.BooleanField(default=True, verbose_name="Ativo neste dia")

    class Meta:
        unique_together = ('personal', 'day_of_week')
        ordering = ['day_of_week']

    def __str__(self):
        return f"{self.get_day_of_week_display()} - {self.personal.get_full_name()}"
