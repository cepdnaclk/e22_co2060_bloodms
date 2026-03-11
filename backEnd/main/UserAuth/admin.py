
# Register your models here.
from django.contrib import admin
from .models import User, Profile

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'fullName', 'verified']  # Changed from 'full_name' to 'fullName'

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
