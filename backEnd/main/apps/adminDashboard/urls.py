from django.urls import path

from .serviceses.doctorProfileService import (DoctorList, DoctorManageApiView,                                                                       getTotalDoctors,CreateDoctor)
from .serviceses.staffService import StaffList, StaffManageApiView, getTotalStaff

urlpatterns = [
    path("doctor/profile/<int:id>/", DoctorManageApiView.as_view(), name="doctor_profile_manage"),
    path("doctors/list/", DoctorList.as_view(), name="doctor_list"),
    path("doctor/create/",CreateDoctor.as_view(),name="create doctor"),
    path("doctor/total/", getTotalDoctors, name="doctor_total"),
    path("staff/profile/<int:id>/", StaffManageApiView.as_view(), name="staff_profile_manage"),
    path("staff/list/", StaffList.as_view(), name="staff_list"),
    path("staff/total/", getTotalStaff, name="staff_total"),
]