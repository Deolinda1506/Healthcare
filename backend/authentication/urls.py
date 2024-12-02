from django.urls import path
from . import views

urlpatterns = [
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('register/', views.register, name='register'),
    path('health-metrics/', views.get_health_metrics, name='get_health_metrics'),
    path('update-health-metrics/', views.update_health_metrics, name='update_health_metrics'),
    path('availability/', views.change_availability, name='change_availability'),
    path('profile/', views.get_profile, name='get_profile'),
]

