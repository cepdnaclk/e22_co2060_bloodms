from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ...models.inventoryChangeRequest import InventoryChangeRequest
from ...permissions.inventory_permissions import IsInventoryOfficer
from ...serializers.request.inventoryChangeRequestSerializer import (
    InventoryChangeRequestCreateSerializer,
)
from ...serializers.response.inventoryChangeResponseSerializer import (
    InventoryChangeRequestResponseSerializer,
)


class InventoryChangeRequestCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsInventoryOfficer]
    serializer_class = InventoryChangeRequestCreateSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class InventoryOfficerChangeRequestListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsInventoryOfficer]
    serializer_class = InventoryChangeRequestResponseSerializer

    def get_queryset(self):
        return InventoryChangeRequest.objects.filter(created_by=self.request.user).order_by(
            "-created_at"
        )


