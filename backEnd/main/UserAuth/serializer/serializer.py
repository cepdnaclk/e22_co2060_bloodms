from ..models.models import User, Profile
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        # Match the actual field names in the model
        fields = ['fullName', 'nic_number', 'phoneNumber', 'blood_group', 'country', 'district', 'hospital']
