from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from backEnd.main.apps.medicalOfficers.serializers.response.docterResponse import DoctorResponseSerializer
from backEnd.main.apps.medicalOfficers.models.doctor import DoctorProfile

from rest_framework import generics, status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist


class DoctorManageApiView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DoctorResponseSerializer

    def get_object(self):
        profile_id = self.kwargs.get("id")
        if profile_id is None:
            return None

        try:
            return DoctorProfile.objects.get(id=profile_id)
        except ObjectDoesNotExist:
            # 404 handled manually for custom message
            return None

    # --- 1. Custom GET Response ---
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(
                {"status": "error", "message": "Doctor profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(instance)
        return Response({
            "status": "success",
            "message": "Profile retrieved successfully",
            "data": serializer.data
        })

    # --- 2. Custom UPDATE Response ---
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if instance is None:
            return Response(
                {"status": "error", "message": "Doctor profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({
                "status": "success",
                "message": "Profile updated successfully",
                "data": serializer.data
            })

        # 400 Error with validation details
        return Response({
            "status": "error",
            "message": "Update failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # --- 3. Custom DELETE Response ---
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
            self.perform_destroy(instance)
            return Response({
                "status": "success",
                "message": "Profile deleted successfully"
            }, status=status.HTTP_200_OK)  # Changed from 204 to 200 to show message

        return Response(
            {"status": "error", "message": "Profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )




class DoctorList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorResponseSerializer
    # This automatically calls your "getAll" logic when you visit the URL



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTotalDoctors(request):
    count = DoctorProfile.objects.count()

    if count == 0:
        return Response(
            {"message": "No doctors found in the system!", "total_doctors": 0},
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response({"total_doctors": count}, status=status.HTTP_200_OK)
