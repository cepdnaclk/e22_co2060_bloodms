from rest_framework import serializers

from ...models.inventoryChangeRequest import InventoryChangeRequest


class InventoryChangeRequestResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryChangeRequest
        fields = "__all__"
        read_only_fields = [
            "id",
            "status",
            "created_by",
            "admin_reviewer",
            "quality_reviewer",
            "final_approver",
            "created_at",
            "updated_at",
            "executed_at",
        ]

