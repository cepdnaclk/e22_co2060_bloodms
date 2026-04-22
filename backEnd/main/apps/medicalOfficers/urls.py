from django.urls import path
from .services.docterViews.docterService import UpdateDoctorImageView

urlpatterns = [
    path('doctor/profile-pic/', UpdateDoctorImageView.as_view(), name='update-doctor-image'),
]
