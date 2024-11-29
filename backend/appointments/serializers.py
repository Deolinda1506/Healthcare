from rest_framework import serializers
from .models import *
from authentication.serializers import PatientProfileSerializer, DoctorProfileSerializer

class PrescriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prescription
        fields = ['id', 'prescription', 'dosage', 'description', 'valid', 'unique_link', 'refill_request', 'created_at']


class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientProfileSerializer()
    doctor = DoctorProfileSerializer()
    prescription = PrescriptionSerializer()

    class Meta:
        model = Appointment
        fields = ['id', 'prescription', 'start', 'call_id', 'report', 'diagnosis', 'patient', 'doctor', 'completed', 'cancelled', 'created_at']

    def update(self, instance, validated_data):
        """
        Update and return an existing `PatientProfile` instance, given the validated data.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
