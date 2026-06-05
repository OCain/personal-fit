from django import forms
from django.contrib.auth import get_user_model
from .models import ClientProfile

User = get_user_model()

class ClientCreationForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=True, label="Nome")
    last_name = forms.CharField(max_length=150, required=True, label="Sobrenome")
    email = forms.EmailField(required=True, label="E-mail")
    username = forms.CharField(max_length=150, required=True, label="Usuário")
    password = forms.CharField(widget=forms.PasswordInput, required=True, label="Senha Provisória")

    class Meta:
        model = ClientProfile
        fields = ['cpf', 'address']

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Este nome de usuário já está em uso.")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email or '@' not in email:
            raise forms.ValidationError("Por favor, insira um endereço de e-mail válido contendo '@'.")
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Este e-mail já está em uso.")
        return email

    def clean_cpf(self):
        cpf = self.cleaned_data.get('cpf')
        if cpf:
            cpf_digits = ''.join(filter(str.isdigit, cpf))
            if len(cpf_digits) != 11:
                raise forms.ValidationError("O CPF deve conter exatamente 11 dígitos.")
            return cpf_digits
        return cpf

    def save(self, commit=True, personal=None):
        # Create user
        user = User.objects.create_user(
            username=self.cleaned_data['username'],
            email=self.cleaned_data['email'],
            password=self.cleaned_data['password'],
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            is_aluno=True
        )
        
        # Create profile
        profile = super().save(commit=False)
        profile.user = user
        if personal:
            profile.personal = personal
        
        if commit:
            profile.save()
            
        return profile

class ClientUpdateForm(forms.ModelForm):
    class Meta:
        model = ClientProfile
        fields = ['cpf', 'address']

    def clean_cpf(self):
        cpf = self.cleaned_data.get('cpf')
        if cpf:
            cpf_digits = ''.join(filter(str.isdigit, cpf))
            if len(cpf_digits) != 11:
                raise forms.ValidationError("O CPF deve conter exatamente 11 dígitos.")
            return cpf_digits
        return cpf

from training.models import Workout, Session, SessionExercise, ExerciseCatalog
from django.forms import inlineformset_factory

class WorkoutForm(forms.ModelForm):
    class Meta:
        model = Workout
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ex: Projeto Verão'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Opcional: orientações gerais sobre o treino...'}),
        }

class SessionForm(forms.ModelForm):
    class Meta:
        model = Session
        fields = ['name', 'days_of_week']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ex: Treino A - Peito e Tríceps'}),
            'days_of_week': forms.CheckboxSelectMultiple(),
        }

class SessionExerciseForm(forms.ModelForm):
    class Meta:
        model = SessionExercise
        fields = ['exercise', 'sets', 'reps', 'notes', 'order']
        widgets = {
            'exercise': forms.Select(attrs={'class': 'form-select'}),
            'sets': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Séries'}),
            'reps': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Repetições (ex: 10-12)'}),
            'notes': forms.Textarea(attrs={'class': 'form-control', 'rows': 1, 'placeholder': 'Observações...'}),
            'order': forms.HiddenInput(),
        }

SessionExerciseFormSet = inlineformset_factory(
    Session, 
    SessionExercise, 
    form=SessionExerciseForm, 
    extra=1, 
    can_delete=True
)
