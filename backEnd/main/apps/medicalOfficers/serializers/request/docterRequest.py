
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ...models import DoctorProfile

User = get_user_model()


class DoctorProfileSerializer(serializers.ModelSerializer):
    # Map User model fields to the flat JSON structure React expects
    id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    full_name = serializers.SerializerMethodField()

    # Map the differently named profile fields to match React
    hospital = serializers.CharField(source='hospital_affiliation', required=False)
    phone = serializers.CharField(source='work_phone')
    is_active = serializers.BooleanField(source='active', default=False)

    class Meta:
        model = DoctorProfile
        # Notice we use the REACT field names here, mapped above
        fields = [
            'id', 'username', 'email', 'full_name',
            'specialization', 'phone', 'license_number',
            'hospital', 'is_active'
        ]

    # Combine first and last name for React's 'full_name'
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    # Override the create method because we have to create a User AND a DoctorProfile
    def create(self, validated_data):
        # Extract user data
        user_data = validated_data.pop('user')

        # Extract profile data (renaming back to Django model fields)
        profile_data = {
            'specialization': validated_data.get('specialization', ''),
            'license_number': validated_data.get('license_number', ''),
            'hospital_affiliation': validated_data.get('hospital_affiliation', ''),
            'work_phone': validated_data.get('work_phone', ''),
            'active': validated_data.get('active', True),
        }

        # 1. Create the User first
        # We generate a temporary password if one isn't provided, since React has a separate credential system
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', '')
        )

        # Basic split for full_name if needed, or you can just leave first/last blank
        # user.first_name = ...

        # 2. Create the DoctorProfile attached to that User
        doctor_profile = DoctorProfile.objects.create(user=user, **profile_data)

        return doctor_profile

class Imagechange(serializers.ModelSerializer):
    class Meta:
        model=DoctorProfile
        fields='profilePhoto'