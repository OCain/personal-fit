from django.contrib import admin
from .models import Workout, Session, SessionExercise, ExerciseCatalog, ProgressRecord, Schedule, DayOfWeek

@admin.register(DayOfWeek)
class DayOfWeekAdmin(admin.ModelAdmin):
    list_display = ('day', 'get_day_display')

class SessionInline(admin.TabularInline):
    model = Session
    extra = 1

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'client', 'created_at')
    inlines = [SessionInline]

@admin.register(ExerciseCatalog)
class ExerciseCatalogAdmin(admin.ModelAdmin):
    list_display = ('name', 'muscle_group', 'is_compound')
    list_filter = ('muscle_group', 'is_compound')
    search_fields = ('name',)

@admin.register(ProgressRecord)
class ProgressRecordAdmin(admin.ModelAdmin):
    list_display = ('exercise', 'date_executed', 'completed')

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('client', 'personal', 'date', 'time', 'status')
