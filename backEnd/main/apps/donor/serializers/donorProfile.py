from rest_framework import serializers
from apps.UserAuth.models.models import User, Profile
from ..models.donorDetails import DonorDetails

class DonorProfileSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='user.profile.fullName', read_only=True)
    nic_number = serializers.CharField(source='user.profile.nic_number', read_only=True)
    blood_group = serializers.CharField(source='user.profile.blood_group', read_only=True)
    phoneNumber = serializers.CharField(source='user.profile.phoneNumber', read_only=True)
    country = serializers.CharField(source='user.profile.country.countryName', read_only=True)
    district = serializers.CharField(source='user.profile.district.districtName', read_only=True)
    hospital = serializers.CharField(source='user.profile.hospital.hosName', read_only=True)

    class Meta:
        model = DonorDetails
        fields = [
            'fullName',
            'nic_number',
            'blood_group',
            'phoneNumber',
            'country',
            'district',
            'hospital',
            'is_available',
            'total_donations',
            'last_donation_date',
            'total_events',
            'achievements',
            'profile_image',
            'qr_id',
        ]