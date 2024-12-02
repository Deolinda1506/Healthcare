from django.core.mail import send_mail
from django.conf import settings
import os

def test_email():
    try:
        # First print the settings to verify they're loaded
        print(f"Email settings:")
        print(f"HOST: {settings.EMAIL_HOST}")
        print(f"PORT: {settings.EMAIL_PORT}")
        print(f"USER: {settings.EMAIL_HOST_USER}")
        print(f"TLS: {settings.EMAIL_USE_TLS}")
        print(f"PASSWORD: {'Set' if settings.EMAIL_HOST_PASSWORD else 'Not Set'}")
        
        send_mail(
            subject='HealthConnect Test Email',
            message='This is a test email from HealthConnect.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['healthconnect141@gmail.com'],
            fail_silently=False,
        )
        print("Test email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        print(f"Error type: {type(e)}")

# Run this in Django shell:
# python manage.py shell
# from test_email import test_email
# test_email() 