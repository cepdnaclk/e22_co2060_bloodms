from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models.bloodinventor import BloodInventory
from ...models.inventoryChangeRequest import InventoryChangeRequest
from ...permissions.inventory_permissions import IsAdminRole
from ...serializers.request.inventoryChangeRequestSerializer import (
    InventoryChangeDecisionSerializer,
    InventoryChangeExecuteSerializer,
)
from ...serializers.response.inventoryChangeResponseSerializer import (
    InventoryChangeRequestResponseSerializer,
)


class AdminPendingInventoryChangeListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    serializer_class = InventoryChangeRequestResponseSerializer

    def get_queryset(self):
        return InventoryChangeRequest.objects.filter(
            status__in=[
                InventoryChangeRequest.StatusType.PENDING_ADMIN_REVIEW,
                InventoryChangeRequest.StatusType.PENDING_QUALITY_CHECK,
                InventoryChangeRequest.StatusType.PENDING_FINAL_ADMIN_APPROVAL,
                InventoryChangeRequest.StatusType.APPROVED_READY_TO_EXECUTE,
            ]
        ).order_by("-created_at")


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminRole])
def admin_review_inventory_change(request, id):
    payload = InventoryChangeDecisionSerializer(data=request.data)
    payload.is_valid(raise_exception=True)

    obj = get_object_or_404(InventoryChangeRequest, id=id)
    if obj.status != InventoryChangeRequest.StatusType.PENDING_ADMIN_REVIEW:
        return Response(
            {"status": "error", "message": "Request is not pending adminDashboard review."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.admin_reviewer = request.user
    obj.admin_note = payload.validated_data.get("note", "")
    obj.status = InventoryChangeRequest.StatusType.PENDING_QUALITY_CHECK
    obj.save(update_fields=["admin_reviewer", "admin_note", "status", "updated_at"])

    return Response(
        {
            "status": "success",
            "message": "Admin review completed.",
            "data": InventoryChangeRequestResponseSerializer(obj).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminRole])
def quality_check_inventory_change(request, id):
    payload = InventoryChangeDecisionSerializer(data=request.data)
    payload.is_valid(raise_exception=True)

    obj = get_object_or_404(InventoryChangeRequest, id=id)
    if obj.status != InventoryChangeRequest.StatusType.PENDING_QUALITY_CHECK:
        return Response(
            {"status": "error", "message": "Request is not pending quality check."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.quality_reviewer = request.user
    obj.quality_note = payload.validated_data.get("note", "")
    obj.status = InventoryChangeRequest.StatusType.PENDING_FINAL_ADMIN_APPROVAL
    obj.save(update_fields=["quality_reviewer", "quality_note", "status", "updated_at"])

    return Response(
        {
            "status": "success",
            "message": "Quality check completed.",
            "data": InventoryChangeRequestResponseSerializer(obj).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminRole])
def final_approve_inventory_change(request, id):
    payload = InventoryChangeDecisionSerializer(data=request.data)
    payload.is_valid(raise_exception=True)

    obj = get_object_or_404(InventoryChangeRequest, id=id)
    if obj.status != InventoryChangeRequest.StatusType.PENDING_FINAL_ADMIN_APPROVAL:
        return Response(
            {
                "status": "error",
                "message": "Request is not pending final adminDashboard approval.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.final_approver = request.user
    obj.final_note = payload.validated_data.get("note", "")
    obj.status = InventoryChangeRequest.StatusType.APPROVED_READY_TO_EXECUTE
    obj.save(update_fields=["final_approver", "final_note", "status", "updated_at"])

    return Response(
        {
            "status": "success",
            "message": "Final approval completed.",
            "data": InventoryChangeRequestResponseSerializer(obj).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminRole])
def reject_inventory_change(request, id):
    payload = InventoryChangeDecisionSerializer(data=request.data)
    payload.is_valid(raise_exception=True)

    obj = get_object_or_404(InventoryChangeRequest, id=id)
    if obj.status in [
        InventoryChangeRequest.StatusType.EXECUTED,
        InventoryChangeRequest.StatusType.REJECTED,
        InventoryChangeRequest.StatusType.CANCELLED,
    ]:
        return Response(
            {"status": "error", "message": "Request cannot be rejected in current state."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.final_note = payload.validated_data.get("note", "")
    obj.status = InventoryChangeRequest.StatusType.REJECTED
    obj.save(update_fields=["final_note", "status", "updated_at"])

    return Response(
        {
            "status": "success",
            "message": "Request rejected.",
            "data": InventoryChangeRequestResponseSerializer(obj).data,
        },
        status=status.HTTP_200_OK,
    )


def _execute_inventory_mutation(obj):
    if obj.action == InventoryChangeRequest.ActionType.ADD:
        if obj.quantity_delta <= 0:
            raise ValueError("quantity_delta must be positive for ADD action.")

        if not obj.blood_bank:
            raise ValueError("blood_bank is required for ADD action.")

        BloodInventory.objects.create(
            blood_type=obj.blood_type,
            quantity=obj.quantity_delta,
            blood_bank=obj.blood_bank,
            collected_date=obj.collected_date,
            expiry_date=obj.expiry_date,
            temperature=obj.temperature if obj.temperature is not None else 4,
            status="available",
        )
        return

    if not obj.inventory_id:
        raise ValueError("inventory is required for this action.")

    inventory = BloodInventory.objects.select_for_update().get(id=obj.inventory_id)

    if obj.action == InventoryChangeRequest.ActionType.ADJUST:
        new_quantity = inventory.quantity + obj.quantity_delta
        if new_quantity < 0:
            raise ValueError("Adjustment would result in negative stock.")
        inventory.quantity = new_quantity
        inventory.save(update_fields=["quantity", "updated_at"])
        return

    if obj.action == InventoryChangeRequest.ActionType.DELETE:
        inventory.status = "deleted"
        inventory.save(update_fields=["status", "updated_at"])
        return

    if obj.action == InventoryChangeRequest.ActionType.MARK_DAMAGED:
        inventory.status = "damaged"
        inventory.save(update_fields=["status", "updated_at"])
        return

    if obj.action == InventoryChangeRequest.ActionType.MARK_EXPIRED:
        inventory.status = "expired"
        inventory.save(update_fields=["status", "updated_at"])
        return

    raise ValueError("Unsupported action type.")


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminRole])
def execute_inventory_change(request, id):
    payload = InventoryChangeExecuteSerializer(data=request.data)
    payload.is_valid(raise_exception=True)

    obj = get_object_or_404(InventoryChangeRequest, id=id)
    if obj.status != InventoryChangeRequest.StatusType.APPROVED_READY_TO_EXECUTE:
        return Response(
            {"status": "error", "message": "Request is not approved for execution."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        with transaction.atomic():
            _execute_inventory_mutation(obj)
            obj.executed_at = timezone.now()
            obj.final_note = payload.validated_data.get("note", obj.final_note)
            obj.status = InventoryChangeRequest.StatusType.EXECUTED
            obj.save(update_fields=["executed_at", "final_note", "status", "updated_at"])
    except BloodInventory.DoesNotExist:
        return Response(
            {"status": "error", "message": "Target inventory record was not found."},
            status=status.HTTP_404_NOT_FOUND,
        )
    except ValueError as ex:
        return Response(
            {"status": "error", "message": str(ex)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {
            "status": "success",
            "message": "Inventory change executed successfully.",
            "data": InventoryChangeRequestResponseSerializer(obj).data,
        },
        status=status.HTTP_200_OK,
    )

