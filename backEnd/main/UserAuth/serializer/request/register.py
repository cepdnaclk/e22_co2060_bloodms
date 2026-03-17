from rest_framework import serializers
from ...models import User, Profile
from ..serializer import ProfileSerializer


class RegisterSerializer(serializers.ModelSerializer):
    # Nest the ProfileSerializer here
    profile = ProfileSerializer()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'role', 'password', 'password2', 'profile']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        # 1. Pop out the profile data before creating the User
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        validated_data.pop('password2')

        # 2. Create the User (triggers your signal)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            role=validated_data.get('role', 'patient')
        )

        # 3. Update the Profile (created by post_save signal)
        # We use .update because the signal already created the row
        Profile.objects.filter(user=user).update(**profile_data)

        return user

