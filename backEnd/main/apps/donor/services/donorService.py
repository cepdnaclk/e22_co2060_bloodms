from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from ..serializers.donorProfile import DonorProfileSerializer
from ..models.donorDetails import DonorDetails


class DonorProfileView(RetrieveAPIView, UpdateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.request.user.role != "donor":
            raise PermissionDenied("Unauthorized")

        donor_detail, _ = DonorDetails.objects.get_or_create(user=self.request.user)
        return donor_detail