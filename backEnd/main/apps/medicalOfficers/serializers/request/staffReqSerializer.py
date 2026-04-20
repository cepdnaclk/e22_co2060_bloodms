import re

from rest_framework import serializers
from ...models.hospitalStaff import StaffProfile

class StaffRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model=StaffProfile
        fields='__all__'


        def validateJob(self,data):
            ROLES = ["TEC", "MANG", "NURSE"]
            if data.get('designation') not in ROLES:
                raise serializers.ValidationError(
                    "invalid employee"
                )

        def emolyeeId(self, value):
            normalized_value = value.strip().upper()
            if not re.fullmatch(r"STFF\d{5}", normalized_value):
                raise serializers.ValidationError(
                    "Invalid license format. Expected format: STFF##### (example: STFF12345)."
                )
            return normalized_value