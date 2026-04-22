from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ...medicalOfficers.serializers.response.docterResponse import DoctorResponseSerializer
from ...medicalOfficers.models.doctor import DoctorProfile

from rest_framework import generics, status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAdminUser


class DoctorManageApiView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
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

class CreateDoctor(generics.CreateAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorResponseSerializer