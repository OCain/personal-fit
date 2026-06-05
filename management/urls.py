from django.urls import path
from .views import DashboardView, ClientCreateView, ClientUpdateView, ClientDeleteView, ClientDetailView, WorkoutCreateView, WorkoutUpdateView, WorkoutDeleteView, AgendaView, WorkingHoursView, ScheduleUpdateStatusView, WorkoutDetailView, WorkoutArchiveView, WorkoutSaveAPIView

app_name = 'management'

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('agenda/', AgendaView.as_view(), name='agenda'),
    path('schedule/<int:pk>/status/', ScheduleUpdateStatusView.as_view(), name='schedule_update_status'),
    path('settings/working-hours/', WorkingHoursView.as_view(), name='working_hours'),
    path('client/new/', ClientCreateView.as_view(), name='client_create'),
    path('client/<int:pk>/', ClientDetailView.as_view(), name='client_detail'),
    path('client/<int:pk>/edit/', ClientUpdateView.as_view(), name='client_edit'),
    path('client/<int:pk>/delete/', ClientDeleteView.as_view(), name='client_delete'),
    path('client/<int:pk>/workout/new/', WorkoutCreateView.as_view(), name='workout_create'),
    path('workout/<int:pk>/', WorkoutDetailView.as_view(), name='workout_detail'),
    path('workout/<int:pk>/archive/', WorkoutArchiveView.as_view(), name='workout_archive'),
    path('workout/<int:pk>/edit/', WorkoutUpdateView.as_view(), name='workout_edit'),
    path('workout/<int:pk>/delete/', WorkoutDeleteView.as_view(), name='workout_delete'),
    path('workout/<int:pk>/save_api/', WorkoutSaveAPIView.as_view(), name='workout_save_api'),
]
