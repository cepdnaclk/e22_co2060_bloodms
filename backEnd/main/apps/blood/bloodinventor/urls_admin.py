from django.urls import path

from .services.admin.inventory_admin_service import (
    AdminPendingInventoryChangeListView,
    admin_review_inventory_change,
    execute_inventory_change,
    final_approve_inventory_change,
    quality_check_inventory_change,
    reject_inventory_change,
)

urlpatterns = [
    path("change-requests/pending/", AdminPendingInventoryChangeListView.as_view(), name="admin_inventory_change_pending"),
    path("change-requests/<int:id>/adminDashboard-review/", admin_review_inventory_change, name="admin_inventory_change_review"),
    path("change-requests/<int:id>/quality-check/", quality_check_inventory_change, name="admin_inventory_change_quality"),
    path("change-requests/<int:id>/final-approve/", final_approve_inventory_change, name="admin_inventory_change_final_approve"),
    path("change-requests/<int:id>/reject/", reject_inventory_change, name="admin_inventory_change_reject"),
    path("change-requests/<int:id>/execute/", execute_inventory_change, name="admin_inventory_change_execute"),
]

