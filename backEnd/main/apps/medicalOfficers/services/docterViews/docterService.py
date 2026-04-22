#docter can change their profile pic



from ...serializers.request.docterRequest import Imagechange

from rest_framework import generics, parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound




class UpdateDoctorImageView(generics.UpdateAPIView):
    serializer_class = Imagechange
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_object(self):
        user = self.request.user

        if not hasattr(user, "doctorprofile"):
            raise NotFound("Doctor profile not found")

        return user.doctorprofile

