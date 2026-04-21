from rest_framework import serializers

from ...models.inventoryChangeRequest import InventoryChangeRequest


class InventoryChangeRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryChangeRequest
        fields = [
            "action",
            "inventory",
            "blood_bank",
            "blood_type",
            "quantity_delta",
            "reason",
            "collected_date",
            "expiry_date",
            "temperature",
        ]

    def validate(self, attrs):
        action = attrs.get("action")
        quantity_delta = attrs.get("quantity_delta", 0)

        if action == InventoryChangeRequest.ActionType.ADD and quantity_delta <= 0:
            raise serializers.ValidationError("quantity_delta must be positive for ADD action.")

        if action in [
            InventoryChangeRequest.ActionType.DELETE,
            InventoryChangeRequest.ActionType.MARK_DAMAGED,
            InventoryChangeRequest.ActionType.MARK_EXPIRED,
        ] and not attrs.get("inventory"):
            raise serializers.ValidationError("inventory is required for this action.")

        collected_date = attrs.get("collected_date")
        expiry_date = attrs.get("expiry_date")
        if collected_date and expiry_date and expiry_date <= collected_date:
            raise serializers.ValidationError("expiry_date must be after collected_date.")

        return attrs


class InventoryChangeDecisionSerializer(serializers.Serializer):
    note = serializers.CharField(required=False, allow_blank=True)


class InventoryChangeExecuteSerializer(serializers.Serializer):
    note = serializers.CharField(required=False, allow_blank=True)

