from django.db.models import Sum

from ..models.bloodinventor import BloodInventory


def get_available_units_grouped_by_blood_type(today):
    rows = (
        BloodInventory.objects.filter(status="available", expiry_date__gte=today)
        .values("blood_type")
        .annotate(total_units=Sum("quantity"))
    )
    return {row["blood_type"]: int(row["total_units"] or 0) for row in rows}

