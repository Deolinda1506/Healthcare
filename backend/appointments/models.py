from django.db import models
from django.utils import timezone
from authentication.models import PatientProfile, DoctorProfile

# Create your models here.

class Appointment(models.Model):
    """
    Model representing an appointment between a patient and a doctor.

    Attributes:
        start (DateTime): The start time of the appointment.
        call_id (String): The call ID of the appointment.
        report (String): The report of the appointment.
        diagnosis (String): The diagnosis of the appointment.
        patient (ForeignKey): The patient associated with the appointment.
        doctor (ForeignKey): The doctor associated with the appointment.
        prescription (ForeignKey): The prescription associated with the appointment.
        completed (Boolean): Whether the appointment is completed or not.
        cancelled (Boolean): Whether the appointment is cancelled or not.
        created_at (DateTime): The date and time when the appointment was created.
    """
    start = models.DateTimeField(default=timezone.now)
    call_id = models.CharField(max_length=100, blank=True, null=True)
    report = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    prescription = models.ForeignKey('Prescription', on_delete=models.SET_NULL, blank=True, null=True, related_name='appointment_prescriptions')
    completed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Appointment between {self.patient} and Dr. {self.doctor} on {self.start.strftime('%Y-%m-%d %H:%M')}"

class Prescription(models.Model):
    """
    Model representing a prescription for an appointment.

    Attributes:
        description (String): The description of the prescription.
        dosage (String): The dosage instructions of the prescription.
        prescription (String): The actual prescription details.
        created_at (DateTime): The date and time when the prescription was created.
        appointment (ForeignKey): The appointment associated with the prescription.
    """
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='prescriptions')
    description = models.TextField(blank=True, null=True)
    dosage = models.TextField(blank=True, null=True)
    prescription = models.TextField()
    valid = models.BooleanField(default=True)
    unique_link = models.TextField(blank=True, null=True)
    refill_request = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Prescription for {self.appointment}"
