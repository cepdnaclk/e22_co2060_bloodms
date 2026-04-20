import re


from rest_framework import serializers

from ...models.doctor import DoctorProfile


class DoctorReqSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = "__all__"

    def validate_license_number(self, value):
        normalized_value = value.strip().upper()
        if not re.fullmatch(r"DOC\d{5}", normalized_value):
            raise serializers.ValidationError(
                "Invalid license format. Expected format: DOC##### (example: DOC12345)."
            )
        return normalized_value

    def validate_work_phone(self, value):
        # Allow empty value because model has blank=True.
        if not value:
            return value

        cleaned_value = value.strip()
        if not re.fullmatch(r"\+?[0-9\-\s]{7,20}", cleaned_value):
            raise serializers.ValidationError(
                "Invalid phone number. Use digits with optional spaces/hyphens and optional leading +."
            )
        return cleaned_value

    def validate_specialization(self, value):
        cleaned_value = value.strip()
        if not cleaned_value:
            raise serializers.ValidationError("Specialization is required.")
        return cleaned_value

    def validate_hospital_affiliation(self, value):
        cleaned_value = value.strip()
        if not cleaned_value:
            raise serializers.ValidationError("Hospital affiliation is required.")
        return cleaned_value

    def validate_department(self, value):
        cleaned_value = value.strip()
        if not cleaned_value:
            raise serializers.ValidationError("Department is required.")
        return cleaned_value

