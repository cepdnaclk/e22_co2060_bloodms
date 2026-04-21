from django.urls import path

from ..services.officer.inventory_officer_service import (
    InventoryChangeRequestCreateView,
    InventoryOfficerChangeRequestListView,
)

urlpatterns = [
    path("change-requests/", InventoryChangeRequestCreateView.as_view(), name="inventory_change_create"),
    path("change-requests/my/", InventoryOfficerChangeRequestListView.as_view(), name="inventory_change_my"),
]

