from django.db import models
from django.conf import settings
from management.models import ClientProfile

class Workout(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='workouts', verbose_name="Aluno")
    name = models.CharField(max_length=100, verbose_name="Nome do Treino")
    description = models.TextField(blank=True, verbose_name="Descrição")
    is_archived = models.BooleanField(default=False, verbose_name="Arquivado")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.client.user.get_full_name()}"

class DayOfWeek(models.Model):
    DAY_CHOICES = [
        (0, 'Segunda-feira'),
        (1, 'Terça-feira'),
        (2, 'Quarta-feira'),
        (3, 'Quinta-feira'),
        (4, 'Sexta-feira'),
        (5, 'Sábado'),
        (6, 'Domingo'),
    ]
    day = models.IntegerField(choices=DAY_CHOICES, unique=True)

    class Meta:
        ordering = ['day']

    def __str__(self):
        return self.get_day_display()

class Session(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='sessions', verbose_name="Treino")
    name = models.CharField(max_length=50, verbose_name="Nome da Sessão", help_text="Ex: Treino A, Costas, etc.")
    days_of_week = models.ManyToManyField(DayOfWeek, related_name='sessions', verbose_name="Dias da Semana")

    class Meta:
        ordering = ['id']

    @property
    def days_display(self):
        return ", ".join([d.get_day_display() for d in self.days_of_week.all()])

    def __str__(self):
        return f"{self.name} ({self.days_display}) - {self.workout.name}"

class ExerciseCatalog(models.Model):
    MUSCLE_GROUP_CHOICES = [
        ('Peito', 'Peito'),
        ('Costas', 'Costas'),
        ('Ombros', 'Ombros'),
        ('Bíceps', 'Bíceps'),
        ('Tríceps', 'Tríceps'),
        ('Quadríceps', 'Quadríceps'),
        ('Posterior de coxa', 'Posterior de coxa'),
        ('Glúteos', 'Glúteos'),
        ('Panturrilhas', 'Panturrilhas'),
        ('Abdômen', 'Abdômen'),
    ]
    name = models.CharField(max_length=150, verbose_name="Nome do Exercício")
    muscle_group = models.CharField(max_length=50, choices=MUSCLE_GROUP_CHOICES, verbose_name="Grupo Muscular")
    is_compound = models.BooleanField(default=True, verbose_name="É Composto?")

    class Meta:
        ordering = ['muscle_group', 'name']

    def __str__(self):
        tipo = "Composto" if self.is_compound else "Isolador"
        return f"{self.name} ({self.muscle_group} - {tipo})"

class SessionExercise(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='exercises')
    exercise = models.ForeignKey(ExerciseCatalog, on_delete=models.CASCADE, verbose_name="Exercício")
    sets = models.PositiveIntegerField(verbose_name="Séries", default=3)
    reps = models.CharField(max_length=50, verbose_name="Repetições", default="10-12")
    notes = models.TextField(blank=True, verbose_name="Observações")
    order = models.PositiveIntegerField(verbose_name="Ordem", default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.exercise.name} - {self.session.name}"

class ProgressRecord(models.Model):
    exercise = models.ForeignKey(SessionExercise, on_delete=models.CASCADE, related_name='progress_records')
    date_executed = models.DateField(auto_now_add=True, verbose_name="Data de Execução")
    completed = models.BooleanField(default=False, verbose_name="Concluído")
    feedback = models.TextField(blank=True, verbose_name="Feedback do Aluno")

    def __str__(self):
        return f"{self.exercise.exercise.name} em {self.date_executed}"

class Schedule(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pendente'),
        ('C', 'Confirmado'),
        ('X', 'Cancelado'),
    ]
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='schedules')
    personal = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='schedules', limit_choices_to={'is_personal': True})
    date = models.DateField(verbose_name="Data")
    time = models.TimeField(verbose_name="Horário")
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')

    def __str__(self):
        return f"{self.date} às {self.time} - {self.client.user.get_full_name()} com {self.personal.get_full_name()}"
