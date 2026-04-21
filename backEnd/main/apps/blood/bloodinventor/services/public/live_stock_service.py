from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ...selectors.inventory_read_selector import get_available_units_grouped_by_blood_type
from ...serializers.response.inventoryResponseserializer import LiveStockResponseSerializer

BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]


def get_stock_status(total):
    if total < 10:
        return "Critical"
    if total < 30:
        return "Low"
    return "Normal"


@api_view(["GET"])
@permission_classes([AllowAny])
def live_stock(request):
    today = timezone.localdate()
    units_by_type = get_available_units_grouped_by_blood_type(today)

    stock = []
    for blood_type in BLOOD_TYPES:
        units = units_by_type.get(blood_type, 0)
        stock.append(
            {
                "bloodType": blood_type,
                "units": units,
                "status": get_stock_status(units),
            }
        )

    payload = {"updatedAt": timezone.now(), "stocks": stock}
    serializer = LiveStockResponseSerializer(payload)
    return Response(serializer.data, status=200)

