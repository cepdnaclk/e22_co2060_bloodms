from rest_framework import serializers

from ...models.hospitalStaff import StaffProfile


class StaffResponseSerializer(serializers.ModelSerializer):
	class Meta:
		model = StaffProfile
		fields = (
			"id",
			"user",
			"employee_id",
			"designation",
			"date_joined",
			"branch_location",
			"shift",
		)
		read_only_fields = ("id", "user", "date_joined")
