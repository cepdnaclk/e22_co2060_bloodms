
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('owner/', include('Admin.urls')),
    path('appointment/', include('Appointment.urls')),
    path('inventory/', include('BloodInventory.urls')),
    path('BRequest/', include('BloodRequest.urls')),
    path('host/', include('CampHost.urls')),
    path('volunteers/', include('CampVolunteers.urls')),
    path('Certificate/', include('Certificate.urls')),
    path('Donationcamp/', include('DonationCamp.urls')),
    path('Donationrecord/', include('DonationRecord.urls')),
    path('Donor/', include('Donor.urls')),
    path('Donationcamp/', include('DonationCamp.urls')),
    path('api/', include('UserAuth.urls')),


]
