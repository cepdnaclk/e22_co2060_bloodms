from django.db import models
from django.conf import settings
import uuid

class DonorDetails(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)
    qr_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    last_donation_date = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='donor_profiles/', null=True, blank=True)

    total_donations = models.PositiveIntegerField(default=0)
    total_events = models.PositiveIntegerField(default=0)
    achievements = models.TextField(blank=True)

    def __str__(self):
        return f"donor: {self.user.username}"
