import os
import sys

print("Starting verification...")
sys.stdout.flush()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    import django
    print("✓ Django imported successfully")
    sys.stdout.flush()

    django.setup()
    print("✓ Django setup completed")
    sys.stdout.flush()

    from django.conf import settings
    print(f"✓ AUTH_USER_MODEL: {settings.AUTH_USER_MODEL}")
    sys.stdout.flush()

    from django.contrib.auth import get_user_model
    User = get_user_model()
    print(f"✓ User Model: {User.__module__}.{User.__name__}")
    sys.stdout.flush()

    from apps.UserAuth.models import Profile
    print(f"✓ Profile Model loaded: {Profile}")
    sys.stdout.flush()

    print("\n✅ ALL TESTS PASSED! Your AUTH_USER_MODEL is correctly configured!")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
