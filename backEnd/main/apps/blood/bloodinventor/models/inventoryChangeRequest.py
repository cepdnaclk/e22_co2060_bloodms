from django.conf import settings
from django.db import models
from .bloodBank import BloodBank
from .bloodinventor import BloodInventory


class InventoryChangeRequest(models.Model):
    class ActionType(models.TextChoices):
        ADD = "ADD", "Add"
        ADJUST = "ADJUST", "Adjust"
        DELETE = "DELETE", "Delete"
        MARK_DAMAGED = "MARK_DAMAGED", "Mark Damaged"
        MARK_EXPIRED = "MARK_EXPIRED", "Mark Expired"

    class StatusType(models.TextChoices):
        PENDING_ADMIN_REVIEW = "PENDING_ADMIN_REVIEW", "Pending Admin Review"
        PENDING_QUALITY_CHECK = "PENDING_QUALITY_CHECK", "Pending Quality Check"
        PENDING_FINAL_ADMIN_APPROVAL = (
            "PENDING_FINAL_ADMIN_APPROVAL",
            "Pending Final Admin Approval",
        )
        APPROVED_READY_TO_EXECUTE = "APPROVED_READY_TO_EXECUTE", "Approved Ready To Execute"
        EXECUTED = "EXECUTED", "Executed"
        REJECTED = "REJECTED", "Rejected"
        CANCELLED = "CANCELLED", "Cancelled"

    action = models.CharField(max_length=32, choices=ActionType)
    status = models.CharField(
        max_length=40,
        choices=StatusType,
        default=StatusType.PENDING_ADMIN_REVIEW,
    )

    inventory = models.ForeignKey(
        BloodInventory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="change_requests",
    )
    blood_bank = models.ForeignKey(
        BloodBank,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inventory_change_requests",
    )

    blood_type = models.CharField(max_length=3, blank=True)
    quantity_delta = models.IntegerField(default=0)
    reason = models.TextField(blank=True)

    collected_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inventory_change_created",
    )
    admin_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inventory_change_admin_reviewed",
    )
    quality_reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inventory_change_quality_reviewed",
    )
    final_approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inventory_change_final_approved",
    )

    admin_note = models.TextField(blank=True)
    quality_note = models.TextField(blank=True)
    final_note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    executed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.action} - {self.status}"
