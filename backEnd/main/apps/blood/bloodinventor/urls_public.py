from django.urls import path

from .services.public.live_stock_service import live_stock

urlpatterns = [
    path("live-stock/", live_stock, name="live_stock"),
]

