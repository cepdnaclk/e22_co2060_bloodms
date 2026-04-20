from django.db import models
from django.conf import settings


class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')

    # 1. Professional Details
    specialization = models.CharField(max_length=100)
    qualifications = models.CharField(max_length=255, help_text="e.g., MBBS, MD - Cardiology")
    license_number = models.CharField(max_length=50, unique=True, help_text="Medical board license number")
    active=models.BooleanField(default=False,help_text="doctor is retired or not")

    # 2. Location & Contact
    hospital_affiliation = models.CharField(max_length=255)
    department = models.CharField(max_length=100, help_text="e.g., ER, Surgery, ICU")
    work_phone = models.CharField(max_length=20, blank=True)

    # 3. System Status
    is_verified = models.BooleanField(default=False, help_text="Checked by admin to allow blood requests")
    profilePhoto = models.ImageField(upload_to="doctor_profiles/")

    def __str__(self):
        return f"Dr. {self.user.last_name} ({self.specialization})"