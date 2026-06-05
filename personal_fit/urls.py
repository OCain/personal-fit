from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LogoutView
from users.views import UserLoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('management/', include('management.urls')),
    path('training/', include('training.urls')),
    path('', UserLoginView.as_view(), name='home'),
]
