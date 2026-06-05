from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy

class UserLoginView(LoginView):
    template_name = 'users/login.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        user = self.request.user
        if user.is_personal:
            return reverse_lazy('management:dashboard')
        elif user.is_aluno:
            return reverse_lazy('training:dashboard')
        return reverse_lazy('admin:index')
