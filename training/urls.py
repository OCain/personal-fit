from django.urls import path
from .views import DashboardAlunoView, MarkExerciseDoneView, ScheduleCreateView, ScheduleListView

app_name = 'training'

urlpatterns = [
    path('dashboard/', DashboardAlunoView.as_view(), name='dashboard'),
    path('exercise/<int:pk>/done/', MarkExerciseDoneView.as_view(), name='mark_done'),
    path('schedule/new/', ScheduleCreateView.as_view(), name='schedule_create'),
    path('schedule/', ScheduleListView.as_view(), name='schedule_list'),
]
