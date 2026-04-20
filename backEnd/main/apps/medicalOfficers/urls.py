from django.urls import path

from .services.docterViews.docterService import DoctorList, DoctorManageApiView, getTotalDoctors
from .services.staffViews.staffService import StaffList, StaffManageApiView, getTotalStaff

urlpatterns = [
    path("doctor/profile/<int:id>/", DoctorManageApiView.as_view(), name="doctor_profile_manage"),
    path("doctor/list/", DoctorList.as_view(), name="doctor_list"),
    path("doctor/total/", getTotalDoctors, name="doctor_total"),
    path("staff/profile/<int:id>/", StaffManageApiView.as_view(), name="staff_profile_manage"),
    path("staff/list/", StaffList.as_view(), name="staff_list"),
    path("staff/total/", getTotalStaff, name="staff_total"),
]