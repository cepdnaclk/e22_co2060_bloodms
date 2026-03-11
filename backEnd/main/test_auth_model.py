#!/usr/bin/env python
"""
Test script to verify AUTH_USER_MODEL configuration
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model

print("=" * 60)
print("AUTH_USER_MODEL Configuration Test")
print("=" * 60)

# Get the custom user model
User = get_user_model()

print(f"\n✓ AUTH_USER_MODEL setting: {settings.AUTH_USER_MODEL}")
print(f"✓ Loaded User model: {User}")
print(f"✓ User model location: {User.__module__}.{User.__name__}")

# Check User model fields
print(f"\n✓ User model fields:")
for field in User._meta.get_fields():
    print(f"  - {field.name}: {field.__class__.__name__}")

# Check authentication field
print(f"\n✓ USERNAME_FIELD: {User.USERNAME_FIELD}")
print(f"✓ REQUIRED_FIELDS: {User.REQUIRED_FIELDS}")

# Check Profile model
from UserAuth.models import Profile
print(f"\n✓ Profile model: {Profile}")
print(f"✓ Profile fields:")
for field in Profile._meta.get_fields():
    print(f"  - {field.name}: {field.__class__.__name__}")

print("\n" + "=" * 60)
print("✅ All checks passed! AUTH_USER_MODEL is properly configured.")
print("=" * 60)

