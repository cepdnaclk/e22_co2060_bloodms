from rest_framework import serializers

from ...models.bloodBank import BloodBank
from ...models.bloodinventor import BloodInventory


class bloodBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodBank
        fields = ["bloodBankName", "registrationId"]


class BloodInventoryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodInventory
        fields = [
            "blood_type",
            "quantity",
            "blood_bank",
            "collected_date",
            "expiry_date",
            "status",
        ]


class LiveStockSerializer(serializers.Serializer):
    bloodType = serializers.ChoiceField(
        choices=["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    )
    units = serializers.IntegerField(min_value=0)
    status = serializers.ChoiceField(choices=["Critical","Low","Normal" ])


class LiveStockResponseSerializer(serializers.Serializer):
    updatedAt = serializers.DateTimeField()
    stocks = LiveStockSerializer(many=True)
