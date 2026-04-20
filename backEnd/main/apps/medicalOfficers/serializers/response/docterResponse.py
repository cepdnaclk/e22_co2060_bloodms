from rest_framework import serializers
from ...models.doctor import DoctorProfile


class DoctorResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = (
            "id",
            "user",
            "specialization",
            "qualifications",
            "license_number",
            "active",
            "hospital_affiliation",
            "department",
            "work_phone",
            "is_verified",
            "profilePhoto",
        )
        read_only_fields = ("id", "user", "is_verified", "active")

