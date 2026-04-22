from django.db import models


from ....medicalOfficers.models.doctor import DoctorProfile
from ....medicalOfficers.models.hospitalStaff import StaffProfile



class BloodRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        FULFILLED = "FULFILLED", "Fulfilled"
        CANCELLED = "CANCELLED", "Cancelled"

    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name="blood_requests")
    blood_group = models.CharField(max_length=5)  # e.g. A+, O-
    units_requested = models.PositiveIntegerField()
    units_approved = models.PositiveIntegerField(default=0)
    reason = models.TextField(blank=True)
    urgency = models.CharField(max_length=20, default="NORMAL")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    verified_by = models.ForeignKey(
        StaffProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="verified_requests"
    )
    approved_by = models.ForeignKey(
        StaffProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_requests"
    )

    verification_note = models.TextField(blank=True)
    approval_note = models.TextField(blank=True)
    rejection_note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)