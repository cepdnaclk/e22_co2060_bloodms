
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializer.request.register import (
    RegisterSerializer)
from .serializer.payload.payload import MyTokenObtainPairSerializer
from .serializer.serializer import (
    UserSerializer,
    ProfileSerializer
)

from .models.models import Profile

User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT Token view that returns user data along with tokens
    """
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint
    POST /api/auth/register/
    Body: {
        "email": "user@example.com",
        "username": "username",
        "password": "strongpassword",
        "password2": "strongpassword"
    }
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the newly registered user
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role":user.role,
            },
            "message": "User registered successfully",
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current authenticated user's profile
    GET /api/auth/profile/
    """
    user = request.user
    try:
        profile = user.profile
        user_data = UserSerializer(user).data
        profile_data = ProfileSerializer(profile).data

        return Response({
            "user": user_data,
            "profile": profile_data
        }, status=status.HTTP_200_OK)
    except Profile.DoesNotExist:
        return Response({
            "error": "Profile not found"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update user profile
    PUT/PATCH /api/auth/profile/update/
    Body: {
        "fullName": "John Doe",
        "bio": "Blood donor since 2020"
    }
    """
    user = request.user
    try:
        profile = user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully",
                "profile": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Profile.DoesNotExist:
        return Response({
            "error": "Profile not found"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):

    refresh_token = request.data.get("refresh")

    if not refresh_token:
        return Response(
            {"error": "Refresh token required"},
            status=400
        )

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"message": "Logout successful"})

    except Exception:
        return Response({"error": "Invalid token"}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """
    Get basic user information
    GET /api/auth/user/
    """
    user = request.user
    serializer = UserSerializer(user)

    return Response({
        "user": serializer.data,
        "message": "User data retrieved successfully"
    }, status=status.HTTP_200_OK)


