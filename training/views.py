from django.views.generic import ListView, CreateView, View, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from datetime import datetime, timedelta
import calendar
from .models import Workout, ProgressRecord, Schedule, SessionExercise
from management.models import ClientProfile, WorkingHour

class AlunoRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_aluno

class DashboardAlunoView(LoginRequiredMixin, AlunoRequiredMixin, ListView):
    model = Workout
    template_name = 'training/dashboard.html'
    context_object_name = 'workouts'

    def get_queryset(self):
        # Workouts belonging to the logged-in client
        try:
            profile = self.request.user.client_profile
            return Workout.objects.filter(client=profile)
        except ClientProfile.DoesNotExist:
            return Workout.objects.none()

class MarkExerciseDoneView(LoginRequiredMixin, AlunoRequiredMixin, View):
    def post(self, request, pk):
        exercise = get_object_or_404(SessionExercise, pk=pk)
        
        # Verify the exercise belongs to the logged-in student
        if exercise.session.workout.client.user == request.user:
            ProgressRecord.objects.create(
                exercise=exercise,
                completed=True,
                feedback=request.POST.get('feedback', '')
            )
            messages.success(request, f"Exercício '{exercise.exercise.name}' marcado como concluído!")
        else:
            messages.error(request, "Acesso negado.")
            
        return redirect('training:dashboard')

class ScheduleCreateView(LoginRequiredMixin, AlunoRequiredMixin, TemplateView):
    template_name = 'training/schedule_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        today = timezone.now().date()
        profile = self.request.user.client_profile
        personal = profile.personal
        
        try:
            year = int(self.request.GET.get('year', today.year))
            month = int(self.request.GET.get('month', today.month))
        except ValueError:
            year = today.year
            month = today.month
            
        if month < 1:
            month = 12
            year -= 1
        elif month > 12:
            month = 1
            year += 1
            
        cal = calendar.Calendar(firstweekday=6)
        month_days = cal.monthdatescalendar(year, month)
        context['calendar_weeks'] = month_days
        context['current_year'] = year
        context['current_month'] = month
        
        meses_ptbr = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        context['current_month_name'] = meses_ptbr[month]
        context['today'] = today
        
        context['prev_month'] = month - 1 if month > 1 else 12
        context['prev_year'] = year if month > 1 else year - 1
        context['next_month'] = month + 1 if month < 12 else 1
        context['next_year'] = year if month < 12 else year + 1
        
        date_str = self.request.GET.get('date')
        if date_str:
            try:
                selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                if selected_date >= today:
                    context['selected_date'] = selected_date
                    
                    weekday = selected_date.weekday()
                    try:
                        wh = WorkingHour.objects.get(personal=personal, day_of_week=weekday)
                        if wh.is_active:
                            available_times = []
                            current_time = datetime.combine(selected_date, wh.start_time)
                            end_datetime = datetime.combine(selected_date, wh.end_time)
                            
                            while current_time < end_datetime:
                                available_times.append(current_time.time())
                                current_time += timedelta(hours=1)
                                
                            existing_schedules = Schedule.objects.filter(
                                personal=personal,
                                date=selected_date
                            ).exclude(status='X').values_list('time', flat=True)
                            
                            context['available_times'] = [t for t in available_times if t not in existing_schedules]
                        else:
                            context['available_times'] = []
                    except WorkingHour.DoesNotExist:
                        context['available_times'] = []
            except ValueError:
                pass
                
        return context

    def post(self, request, *args, **kwargs):
        date_str = request.POST.get('date')
        time_str = request.POST.get('time')
        
        if not date_str or not time_str:
            messages.error(request, "Data e horário são obrigatórios.")
            return redirect('training:schedule_create')
            
        try:
            schedule_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            schedule_time = datetime.strptime(time_str, '%H:%M').time()
            
            profile = request.user.client_profile
            
            exists = Schedule.objects.filter(
                personal=profile.personal, 
                date=schedule_date, 
                time=schedule_time
            ).exclude(status='X').exists()
            
            if exists:
                messages.error(request, "Este horário não está mais disponível.")
            else:
                Schedule.objects.create(
                    client=profile,
                    personal=profile.personal,
                    date=schedule_date,
                    time=schedule_time
                )
                messages.success(request, "Agendamento solicitado com sucesso!")
                return redirect('training:schedule_list')
        except ValueError:
            messages.error(request, "Formato de data ou hora inválido.")
            
        return redirect('training:schedule_create')

class ScheduleListView(LoginRequiredMixin, AlunoRequiredMixin, ListView):
    model = Schedule
    template_name = 'training/schedule_list.html'
    context_object_name = 'schedules'

    def get_queryset(self):
        profile = self.request.user.client_profile
        return Schedule.objects.filter(client=profile).order_by('-date', '-time')
