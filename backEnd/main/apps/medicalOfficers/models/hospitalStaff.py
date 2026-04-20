from django.db import models
from django.conf import settings


class StaffProfile(models.Model):
    DESIGNATION = [
        ("TEC", "Lab Technician"),
        ("MANG", "Manager"),
        ("NURSE", "Nurse"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='staff_profile')

    # 1. Employment Details
    employee_id = models.CharField(max_length=50, unique=True, help_text="Hospital or Blood Bank ID")
    designation = models.CharField(max_length=100, help_text="e.g., Lab Tech, Inventory Manager, Nurse",choices=DESIGNATION)
    date_joined = models.DateField(auto_now_add=True)

    # 2. Operational Details
    branch_location = models.CharField(max_length=150, default="Main Hospital Blood Bank")

    SHIFT_CHOICES = [
        ('Morning', 'Morning Shift'),
        ('Evening', 'Evening Shift'),
        ('Night', 'Night Shift'),
    ]
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES, default='Morning')

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.designation} ({self.employee_id})"