from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models.hospitalStaff import StaffProfile
from ...serializers.response.StaffResponseSerializer import StaffResponseSerializer


class StaffManageApiView(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = StaffResponseSerializer

	def get_object(self):
		profile_id = self.kwargs.get("id")
		if profile_id is None:
			return None

		try:
			return StaffProfile.objects.get(id=profile_id)
		except ObjectDoesNotExist:
			return None

	def retrieve(self, request, *args, **kwargs):
		instance = self.get_object()
		if instance is None:
			return Response(
				{"status": "error", "message": "Staff profile not found."},
				status=status.HTTP_404_NOT_FOUND,
			)

		serializer = self.get_serializer(instance)
		return Response(
			{
				"status": "success",
				"message": "Profile retrieved successfully",
				"data": serializer.data,
			}
		)

	def update(self, request, *args, **kwargs):
		partial = kwargs.pop("partial", False)
		instance = self.get_object()

		if instance is None:
			return Response(
				{"status": "error", "message": "Staff profile not found."},
				status=status.HTTP_404_NOT_FOUND,
			)

		serializer = self.get_serializer(instance, data=request.data, partial=partial)
		if serializer.is_valid():
			self.perform_update(serializer)
			return Response(
				{
					"status": "success",
					"message": "Profile updated successfully",
					"data": serializer.data,
				}
			)

		return Response(
			{
				"status": "error",
				"message": "Update failed",
				"errors": serializer.errors,
			},
			status=status.HTTP_400_BAD_REQUEST,
		)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		if instance:
			self.perform_destroy(instance)
			return Response(
				{
					"status": "success",
					"message": "Profile deleted successfully",
				},
				status=status.HTTP_200_OK,
			)

		return Response(
			{"status": "error", "message": "Profile not found"},
			status=status.HTTP_404_NOT_FOUND,
		)


class StaffList(generics.ListAPIView):
	permission_classes = [IsAuthenticated]
	queryset = StaffProfile.objects.all()
	serializer_class = StaffResponseSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getTotalStaff(request):
	count = StaffProfile.objects.count()

	if count == 0:
		return Response(
			{"message": "No staff found in the system!", "total_staff": 0},
			status=status.HTTP_404_NOT_FOUND,
		)

	return Response({"total_staff": count}, status=status.HTTP_200_OK)


