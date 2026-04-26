from django.contrib import admin
from .models.donorDetails import DonorDetails

@admin.register(DonorDetails)
class DonorAdmin(admin.ModelAdmin):
    list_display = ("user", "is_available", "last_donation_date", "total_donations")
    search_fields = ("user__username", "user__email", "user__profile__fullName")
    list_filter = ("is_available",)

