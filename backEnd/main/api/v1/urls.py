from django.urls import include, path

urlpatterns = [
    path("auth/", include("apps.UserAuth.urls")),
    path("password_reset/", include('django_rest_passwordreset.urls', namespace='password_reset'))
]
