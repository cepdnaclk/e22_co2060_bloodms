from django.urls import include, path

from ..services.public.live_stock_service import live_stock

urlpatterns = [
    path("public/", include("apps.blood.bloodinventor.urls.public_urls")),
    path("officer/", include("apps.blood.bloodinventor.urls.officer_urls")),
    path("admin/", include("apps.blood.bloodinventor.urls.admin_urls")),
    # Backward-compatible alias used by existing frontend.
    path("live-stock/", live_stock, name="live_stock"),
]
