from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import ClientProfile
from training.models import Workout
from .forms import WorkoutForm

User = get_user_model()

class WorkoutDetailViewTests(TestCase):
    def setUp(self):
        # Create a personal trainer user
        self.personal_user = User.objects.create_user(
            username='personal1',
            password='password123',
            is_personal=True
        )
        
        # Create a client user
        self.client_user = User.objects.create_user(
            username='client1',
            password='password123',
            is_aluno=True
        )
        
        # Create a client profile linked to the personal trainer
        self.client_profile = ClientProfile.objects.create(
            user=self.client_user,
            personal=self.personal_user,
            cpf='123.456.789-00',
            address='Rua dos Bobos, 0'
        )
        
        # Create a workout for the client
        self.workout = Workout.objects.create(
            client=self.client_profile,
            name='Treino de Hipertrofia',
            description='Foco em pernas e costas'
        )
        
        self.url = reverse('management:workout_detail', kwargs={'pk': self.workout.pk})

    def test_workout_detail_view_contains_form_in_context(self):
        # Log in as the personal trainer
        self.client.login(username='personal1', password='password123')
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        
        # Check if 'form' exists in context and is instance of WorkoutForm
        self.assertIn('form', response.context)
        form = response.context['form']
        self.assertIsInstance(form, WorkoutForm)
        self.assertEqual(form.instance, self.workout)

    def test_workout_detail_view_anonymous_redirect(self):
        # Try to access without logging in
        response = self.client.get(self.url)
        self.assertNotEqual(response.status_code, 200)  # Should redirect to login

