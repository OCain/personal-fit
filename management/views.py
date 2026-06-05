from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView, TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.contrib import messages
from django.utils import timezone
from django.forms import modelformset_factory
import calendar
from .models import ClientProfile, WorkingHour
from .forms import ClientCreationForm, ClientUpdateForm
from training.models import Schedule

class PersonalRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_personal

class DashboardView(LoginRequiredMixin, PersonalRequiredMixin, ListView):
    model = ClientProfile
    template_name = 'management/dashboard.html'
    context_object_name = 'clients'

    def get_queryset(self):
        # Only show clients belonging to this personal trainer
        qs = ClientProfile.objects.filter(personal=self.request.user)
        q = self.request.GET.get('q')
        if q:
            qs = qs.filter(user__first_name__icontains=q) | qs.filter(user__last_name__icontains=q) | qs.filter(cpf__icontains=q)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        today = timezone.now().date()
        context['sessions_today_count'] = Schedule.objects.filter(
            personal=self.request.user,
            date=today
        ).exclude(status='X').count()
        return context

class AgendaView(LoginRequiredMixin, PersonalRequiredMixin, TemplateView):
    template_name = 'management/agenda.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        today = timezone.now().date()
        
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
            
        cal = calendar.Calendar(firstweekday=6) # 0=Monday, 6=Sunday
        month_days = cal.monthdatescalendar(year, month)
        
        start_date = month_days[0][0]
        end_date = month_days[-1][-1]
        
        schedules = Schedule.objects.filter(
            personal=self.request.user,
            date__range=[start_date, end_date]
        ).exclude(status='X').select_related('client', 'client__user').order_by('time')
        
        schedules_by_date = {}
        for schedule in schedules:
            if schedule.date not in schedules_by_date:
                schedules_by_date[schedule.date] = []
            schedules_by_date[schedule.date].append(schedule)
            
        # Build template-friendly calendar structure
        calendar_weeks = []
        for week in month_days:
            week_data = []
            for day in week:
                week_data.append({
                    'date': day,
                    'is_current_month': day.month == month,
                    'is_today': day == today,
                    'schedules': schedules_by_date.get(day, [])
                })
            calendar_weeks.append(week_data)
            
        context['calendar_weeks'] = calendar_weeks
        context['all_schedules'] = [s for s in schedules if s.date.month == month]
        context['current_year'] = year
        context['current_month'] = month
        
        meses_ptbr = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        context['current_month_name'] = meses_ptbr[month]
        context['today'] = today
        
        context['prev_month'] = month - 1 if month > 1 else 12
        context['prev_year'] = year if month > 1 else year - 1
        context['next_month'] = month + 1 if month < 12 else 1
        context['next_year'] = year if month < 12 else year + 1
        
        return context

class WorkingHoursView(LoginRequiredMixin, PersonalRequiredMixin, TemplateView):
    template_name = 'management/working_hours.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Ensure 7 records exist
        for i in range(7):
            WorkingHour.objects.get_or_create(
                personal=self.request.user,
                day_of_week=i,
                defaults={'start_time': '08:00', 'end_time': '20:00', 'is_active': True if i < 6 else False}
            )
        
        from django import forms
        WorkingHourFormSet = modelformset_factory(
            WorkingHour, 
            fields=('day_of_week', 'start_time', 'end_time', 'is_active'), 
            extra=0,
            can_delete=False,
            widgets={
                'start_time': forms.TimeInput(attrs={'type': 'time'}),
                'end_time': forms.TimeInput(attrs={'type': 'time'}),
            }
        )
        qs = WorkingHour.objects.filter(personal=self.request.user).order_by('day_of_week')
        if self.request.method == 'POST':
            formset = WorkingHourFormSet(self.request.POST, queryset=qs)
        else:
            formset = WorkingHourFormSet(queryset=qs)
            
        context['formset'] = formset
        return context

    def post(self, request, *args, **kwargs):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            formset.save()
            messages.success(request, "Configurações de horário salvas com sucesso!")
            from django.shortcuts import redirect
            return redirect('management:working_hours')
        return self.render_to_response(context)

class ClientCreateView(LoginRequiredMixin, PersonalRequiredMixin, CreateView):
    form_class = ClientCreationForm
    template_name = 'management/client_form.html'
    success_url = reverse_lazy('management:dashboard')

    def form_valid(self, form):
        self.object = form.save(personal=self.request.user)
        messages.success(self.request, "Aluno cadastrado com sucesso!")
        from django.http import HttpResponseRedirect
        return HttpResponseRedirect(self.get_success_url())

class ClientUpdateView(LoginRequiredMixin, PersonalRequiredMixin, UpdateView):
    model = ClientProfile
    form_class = ClientUpdateForm
    template_name = 'management/client_form.html'
    success_url = reverse_lazy('management:dashboard')

    def get_queryset(self):
        return ClientProfile.objects.filter(personal=self.request.user)

    def form_valid(self, form):
        messages.success(self.request, "Cadastro do aluno atualizado com sucesso!")
        return super().form_valid(form)

class ClientDeleteView(LoginRequiredMixin, PersonalRequiredMixin, DeleteView):
    model = ClientProfile
    template_name = 'management/client_confirm_delete.html'
    success_url = reverse_lazy('management:dashboard')

    def get_queryset(self):
        return ClientProfile.objects.filter(personal=self.request.user)

    def form_valid(self, form):
        success_url = self.get_success_url()
        user = self.object.user
        
        # Deletar o User também exclui o ClientProfile (on_delete=CASCADE)
        user.delete()
        
        messages.success(self.request, "Aluno removido com sucesso.")
        from django.http import HttpResponseRedirect
        return HttpResponseRedirect(success_url)

class ClientDetailView(LoginRequiredMixin, PersonalRequiredMixin, DetailView):
    model = ClientProfile
    template_name = 'management/client_detail.html'
    context_object_name = 'client'

    def get_queryset(self):
        return ClientProfile.objects.filter(personal=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Fetch workouts to display in the profile (RF04)
        context['workouts'] = self.object.workouts.all()
        return context

from .forms import WorkoutForm, SessionForm, SessionExerciseFormSet
from django.shortcuts import get_object_or_404, redirect
from training.models import Workout, Session, DayOfWeek, ExerciseCatalog, SessionExercise
import json
from django.http import JsonResponse
from django.db import transaction

class WorkoutCreateView(LoginRequiredMixin, PersonalRequiredMixin, CreateView):
    model = Workout
    form_class = WorkoutForm
    template_name = 'management/workout_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        client = get_object_or_404(ClientProfile, pk=self.kwargs['pk'], personal=self.request.user)
        context['client_obj'] = client
        return context

    def form_valid(self, form):
        client = self.get_context_data()['client_obj']
        self.object = form.save(commit=False)
        self.object.client = client
        self.object.save()
        messages.success(self.request, f"Treino criado com sucesso para {client.user.first_name}! Agora adicione as sessões.")
        return redirect('management:workout_detail', pk=self.object.pk)

class WorkoutDetailView(LoginRequiredMixin, PersonalRequiredMixin, DetailView):
    model = Workout
    template_name = 'management/workout_detail.html'
    context_object_name = 'workout'

    def get_queryset(self):
        return Workout.objects.filter(client__personal=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Serialize workout data
        sessions = self.object.sessions.all()
        sessions_list = []
        for s in sessions:
            exercises_list = []
            for e in s.exercises.all():
                exercises_list.append({
                    'id': e.id,
                    'exercise_id': e.exercise.id,
                    'exercise_name': e.exercise.name,
                    'sets': e.sets,
                    'reps': e.reps,
                    'notes': e.notes,
                    'order': e.order,
                    '_deleted': False
                })
            
            sessions_list.append({
                'id': s.id,
                'name': s.name,
                'days_of_week': [d.day for d in s.days_of_week.all()],
                'days_display': s.days_display,
                'exercises': exercises_list,
                '_deleted': False
            })
            
        workout_data = {
            'id': self.object.id,
            'name': self.object.name,
            'description': self.object.description,
            'sessions': sessions_list
        }
        
        exercises_catalog = list(ExerciseCatalog.objects.values('id', 'name', 'muscle_group'))
        days_of_week = [{'id': d[0], 'name': d[1]} for d in DayOfWeek.DAY_CHOICES]
        
        context['workout_json'] = json.dumps(workout_data)
        context['exercises_catalog_json'] = json.dumps(exercises_catalog)
        context['days_of_week_json'] = json.dumps(days_of_week)
        context['form'] = WorkoutForm(instance=self.object)
        return context

class WorkoutSaveAPIView(LoginRequiredMixin, PersonalRequiredMixin, View):
    def post(self, request, pk):
        workout = get_object_or_404(Workout, pk=pk, client__personal=request.user)
        try:
            data = json.loads(request.body)
            with transaction.atomic():
                workout.name = data.get('name', workout.name)
                workout.description = data.get('description', workout.description)
                workout.save()

                sessions_data = data.get('sessions', [])
                for s_data in sessions_data:
                    if s_data.get('_deleted'):
                        if s_data.get('id'):
                            Session.objects.filter(id=s_data['id'], workout=workout).delete()
                        continue
                        
                    if s_data.get('id'):
                        session = Session.objects.get(id=s_data['id'], workout=workout)
                        session.name = s_data.get('name', session.name)
                        session.save()
                    else:
                        session = Session.objects.create(
                            workout=workout,
                            name=s_data.get('name', 'Nova Sessão')
                        )
                    
                    days = s_data.get('days_of_week', [])
                    session.days_of_week.clear()
                    for day_int in days:
                        day_obj, _ = DayOfWeek.objects.get_or_create(day=int(day_int))
                        session.days_of_week.add(day_obj)
                        
                    exercises_data = s_data.get('exercises', [])
                    for i, e_data in enumerate(exercises_data):
                        if e_data.get('_deleted'):
                            if e_data.get('id'):
                                SessionExercise.objects.filter(id=e_data['id'], session=session).delete()
                            continue
                            
                        exercise_obj = ExerciseCatalog.objects.get(id=e_data['exercise_id'])
                        if e_data.get('id'):
                            se = SessionExercise.objects.get(id=e_data['id'], session=session)
                            se.exercise = exercise_obj
                            se.sets = int(e_data.get('sets', 3))
                            se.reps = e_data.get('reps', '10-12')
                            se.notes = e_data.get('notes', '')
                            se.order = i
                            se.save()
                        else:
                            SessionExercise.objects.create(
                                session=session,
                                exercise=exercise_obj,
                                sets=int(e_data.get('sets', 3)),
                                reps=e_data.get('reps', '10-12'),
                                notes=e_data.get('notes', ''),
                                order=i
                            )
                            
            messages.success(request, "Treino salvo com sucesso!")
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

class WorkoutUpdateView(LoginRequiredMixin, PersonalRequiredMixin, UpdateView):
    model = Workout
    form_class = WorkoutForm
    template_name = 'management/workout_form.html'

    def get_queryset(self):
        return Workout.objects.filter(client__personal=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['client_obj'] = self.object.client
        return context

    def form_valid(self, form):
        self.object = form.save()
        messages.success(self.request, f"Treino atualizado com sucesso!")
        return redirect('management:workout_detail', pk=self.object.pk)

class WorkoutDeleteView(LoginRequiredMixin, PersonalRequiredMixin, DeleteView):
    model = Workout
    template_name = 'management/workout_confirm_delete.html'

    def get_queryset(self):
        return Workout.objects.filter(client__personal=self.request.user)

    def get_success_url(self):
        return reverse_lazy('management:client_detail', kwargs={'pk': self.object.client.pk})

    def form_valid(self, form):
        messages.success(self.request, "Treino removido com sucesso.")
        return super().form_valid(form)

class WorkoutArchiveView(LoginRequiredMixin, PersonalRequiredMixin, View):
    def post(self, request, pk):
        workout = get_object_or_404(Workout, pk=pk, client__personal=request.user)
        workout.is_archived = not workout.is_archived
        workout.save()
        status_msg = "arquivado" if workout.is_archived else "desarquivado"
        messages.success(request, f"Treino {status_msg} com sucesso.")
        return redirect('management:client_detail', pk=workout.client.pk)



class ScheduleUpdateStatusView(LoginRequiredMixin, PersonalRequiredMixin, View):
    def post(self, request, pk):
        schedule = get_object_or_404(Schedule, pk=pk, personal=request.user)
        new_status = request.POST.get('status')
        if new_status in dict(Schedule.STATUS_CHOICES):
            schedule.status = new_status
            schedule.save()
            if new_status == 'C':
                messages.success(request, "Sessão confirmada com sucesso!")
            elif new_status == 'X':
                messages.success(request, "Sessão cancelada.")
        else:
            messages.error(request, "Status inválido.")
            
        referer = request.META.get('HTTP_REFERER')
        if referer:
            from django.shortcuts import redirect
            return redirect(referer)
        from django.shortcuts import redirect
        return redirect('management:agenda')
