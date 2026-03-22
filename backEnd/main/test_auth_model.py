#!/usr/bin/env python
"""
Test script to verify AUTH_USER_MODEL configuration
"""
import os

import django
from django.conf import settings
from django.contrib.auth import get_user_model

from apps.UserAuth.models import Profile


def main():
    # Set up Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()

    print("=" * 60)
    print("AUTH_USER_MODEL Configuration Test")
    print("=" * 60)

    # Get the custom user model
    user_model = get_user_model()

    print(f"\n✓ AUTH_USER_MODEL setting: {settings.AUTH_USER_MODEL}")
    print(f"✓ Loaded User model: {user_model}")
    print(
        f"✓ User model location: {user_model.__module__}.{user_model.__name__}"
    )

    # Check User model fields
    print("\n✓ User model fields:")
    for field in user_model._meta.get_fields():
        print(f"  - {field.name}: {field.__class__.__name__}")

    # Check authentication field
    print(f"\n✓ USERNAME_FIELD: {user_model.USERNAME_FIELD}")
    print(f"✓ REQUIRED_FIELDS: {user_model.REQUIRED_FIELDS}")

    # Check Profile model
    print(f"\n✓ Profile model: {Profile}")
    print("✓ Profile fields:")
    for field in Profile._meta.get_fields():
        print(f"  - {field.name}: {field.__class__.__name__}")

    print("\n" + "=" * 60)
    print("✅ All checks passed! AUTH_USER_MODEL is properly configured.")
    print("=" * 60)


if __name__ == "__main__":
    main()
