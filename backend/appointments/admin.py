from django.contrib import admin
from .models import Appointment, Prescription

# Register your models here.
admin.site.register([Appointment, Prescription])
