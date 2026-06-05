from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Role flags
    is_personal = models.BooleanField(default=False, help_text="Designates whether this user is a Personal Trainer.")
    is_aluno = models.BooleanField(default=False, help_text="Designates whether this user is an Aluno (Client).")

    def __str__(self):
        return f"{self.username} ({self.get_full_name() or self.email})"
