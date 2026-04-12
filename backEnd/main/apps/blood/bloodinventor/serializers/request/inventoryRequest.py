from datetime import date
from ...models.bloodinventor import BloodInventory
from rest_framework import serializers

class BloodInventoryRequestSerializer(serializers.ModelSerializer):


    class Meta:
        model = BloodInventory
        fields = [
            "blood_type",
            "quantity",
            "blood_bank",
            "collected_date",
            "expiry_date",
            "status"
        ]

    def validate(self, data):
        if data["expiry_date"] <= data["collected_date"]:
            raise serializers.ValidationError(
                "Expiry date must be after collected date"
            )
        if data['quantity']<=0:
            raise serializers.ValidationError(
                "store is low"
            )
        if data ['status']=="BAD":
            raise serializers.ValidationError("danger rechecked blood details")
        return data

