# Backend URL Configuration Guide - Django REST Framework

## 📍 Where to Add URLs

You need to configure URLs in your Django backend. Here's the structure:

```
your_backend_project/
  ├── manage.py
  ├── your_project/
  │   ├── settings.py
  │   ├── urls.py          ← MAIN URL CONFIG
  │   └── wsgi.py
  ├── your_app/
  │   ├── views.py         ← CREATE VIEWS HERE
  │   ├── serializers.py   ← CREATE SERIALIZERS HERE
  │   ├── models.py
  │   ├── urls.py          ← CREATE APP URL CONFIG HERE
  │   └── admin.py
```

---

## 🔧 Step 1: Create Views for Doctor Operations

**File:** `your_app/views.py`

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Doctor, DoctorMessage
from .serializers import DoctorSerializer, DoctorMessageSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing doctors
    Handles: Create, Read, Update, Delete, Search
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users
    
    # ============================================
    # 1. GET /api/v1/doctors/
    # Lists all doctors (with optional search)
    # ============================================
    def get_queryset(self):
        queryset = Doctor.objects.all()
        
        # Handle search parameter: ?search=query
        search_term = self.request.query_params.get('search', None)
        if search_term:
            # Search by ID, name, or email
            queryset = queryset.filter(
                Q(id__icontains=search_term) |
                Q(full_name__icontains=search_term) |
                Q(email__icontains=search_term)
            )
        
        return queryset
    
    # ============================================
    # 2. POST /api/v1/doctors/
    # Create new doctor
    # ============================================
    def create(self, request, *args, **kwargs):
        """
        Expected request body:
        {
            "username": "dr_john",
            "email": "john@hospital.com",
            "full_name": "Dr. John Smith",
            "specialization": "Cardiology",
            "license_number": "LIC123",
            "phone": "9876543210",
            "hospital": "City Hospital"
        }
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # ============================================
    # 3. GET /api/v1/doctors/{id}/
    # Get single doctor
    # ============================================
    # Automatically handled by ModelViewSet
    
    # ============================================
    # 4. PUT /api/v1/doctors/{id}/
    # Update doctor details
    # ============================================
    def update(self, request, *args, **kwargs):
        """
        Expected request body (any fields to update):
        {
            "full_name": "Dr. Updated Name",
            "phone": "9876543212",
            "specialization": "Neurology"
        }
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    # ============================================
    # 5. DELETE /api/v1/doctors/{id}/
    # Delete doctor
    # ============================================
    # Automatically handled by ModelViewSet
    
    # ============================================
    # 6. POST /api/v1/doctors/{id}/create-credentials/
    # Create login credentials for doctor
    # ============================================
    @action(detail=True, methods=['post'])
    def create_credentials(self, request, pk=None):
        """
        Expected request body:
        {
            "password": "Temp@Pass123"
        }
        
        This action:
        1. Creates a User account if doesn't exist
        2. Sets the password
        3. Links to Doctor
        4. Returns credentials info
        """
        doctor = self.get_object()
        password = request.data.get('password')
        
        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create or get User
        from django.contrib.auth.models import User
        user, created = User.objects.get_or_create(
            username=doctor.email,  # Username = email
            defaults={'email': doctor.email}
        )
        
        # Set password
        user.set_password(password)
        user.save()
        
        # Link doctor to user
        doctor.user = user
        doctor.credentials_created = True
        doctor.save()
        
        return Response({
            'username': doctor.email,
            'temporary_password': password,
            'message': 'Credentials created. Doctor must change password on first login',
            'credentials_created': True
        }, status=status.HTTP_200_OK)
    
    # ============================================
    # 7. POST /api/v1/doctors/{id}/reset-password/
    # Reset doctor password
    # ============================================
    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """
        Expected request body:
        {
            "new_password": "NewPass@123"
        }
        """
        doctor = self.get_object()
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response(
                {'error': 'New password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not doctor.user:
            return Response(
                {'error': 'Doctor has no user account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        doctor.user.set_password(new_password)
        doctor.user.save()
        
        return Response({
            'message': 'Password reset successfully'
        }, status=status.HTTP_200_OK)
    
    # ============================================
    # 8. POST /api/v1/doctors/{id}/send-message/
    # Send message to doctor
    # ============================================
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Expected request body:
        {
            "subject": "Important Notice",
            "message": "Please update your credentials..."
        }
        """
        doctor = self.get_object()
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        if not subject or not message:
            return Response(
                {'error': 'Subject and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create message record
        doctor_message = DoctorMessage.objects.create(
            doctor=doctor,
            subject=subject,
            message=message,
            sent_by=request.user
        )
        
        # TODO: Send email to doctor
        # from django.core.mail import send_mail
        # send_mail(
        #     subject,
        #     message,
        #     'admin@hopedrop.com',
        #     [doctor.email],
        #     fail_silently=False,
        # )
        
        return Response({
            'id': doctor_message.id,
            'subject': doctor_message.subject,
            'sent_at': doctor_message.created_at.isoformat(),
            'status': 'sent'
        }, status=status.HTTP_201_CREATED)
    
    # ============================================
    # 9. GET /api/v1/doctors/stats/ (Optional)
    # Get doctor statistics
    # ============================================
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Returns statistics about doctors
        """
        total = Doctor.objects.count()
        active = Doctor.objects.filter(is_active=True).count()
        inactive = Doctor.objects.filter(is_active=False).count()
        
        # By specialization
        specializations = {}
        for doctor in Doctor.objects.values('specialization').distinct():
            spec = doctor['specialization']
            count = Doctor.objects.filter(specialization=spec).count()
            specializations[spec] = count
        
        return Response({
            'total_doctors': total,
            'active_doctors': active,
            'inactive_doctors': inactive,
            'by_specialization': specializations
        }, status=status.HTTP_200_OK)
```

---

## 🏗️ Step 2: Create Models (if you don't have them)

**File:** `your_app/models.py`

```python
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Doctor(models.Model):
    """Doctor model"""
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Doctor Info
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=20)
    
    # Professional Info
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=100, unique=True)
    hospital = models.CharField(max_length=255, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    credentials_created = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.full_name


class DoctorMessage(models.Model):
    """Messages sent to doctors"""
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='messages')
    sent_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    subject = models.CharField(max_length=255)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.doctor.full_name}"
```

---

## 📋 Step 3: Create Serializers

**File:** `your_app/serializers.py`

```python
from rest_framework import serializers
from .models import Doctor, DoctorMessage

class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for Doctor model"""
    class Meta:
        model = Doctor
        fields = [
            'id',
            'full_name',
            'email',
            'username',
            'phone',
            'specialization',
            'license_number',
            'hospital',
            'is_active',
            'credentials_created',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'full_name': {'required': True}
        }


class DoctorMessageSerializer(serializers.ModelSerializer):
    """Serializer for DoctorMessage model"""
    class Meta:
        model = DoctorMessage
        fields = ['id', 'doctor', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['created_at']
```

---

## 🔗 Step 4: Configure URLs

### Option A: Using SimpleRouter (RECOMMENDED)

**File:** `your_app/urls.py` (Create this file if it doesn't exist)

```python
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import DoctorViewSet

# Create router
router = SimpleRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')

app_name = 'doctors'

urlpatterns = [
    path('', include(router.urls)),
]
```

**File:** `your_project/urls.py` (Main project URL config)

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Include app URLs with api/v1 prefix
    path('api/v1/', include('your_app.urls')),
]
```

**Result URLs Generated:**
```
GET    /api/v1/doctors/                         → List all doctors
POST   /api/v1/doctors/                         → Create doctor
GET    /api/v1/doctors/{id}/                    → Get single doctor
PUT    /api/v1/doctors/{id}/                    → Update doctor
DELETE /api/v1/doctors/{id}/                    → Delete doctor
POST   /api/v1/doctors/{id}/create-credentials/ → Create credentials
POST   /api/v1/doctors/{id}/reset-password/     → Reset password
POST   /api/v1/doctors/{id}/send-message/       → Send message
GET    /api/v1/doctors/stats/                   → Get stats
GET    /api/v1/doctors/?search=query            → Search doctors
```

---

### Option B: Manual URL Configuration

If you prefer not to use router:

**File:** `your_app/urls.py`

```python
from django.urls import path
from .views import DoctorViewSet

doctor_list = DoctorViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

doctor_detail = DoctorViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

doctor_create_credentials = DoctorViewSet.as_view({
    'post': 'create_credentials'
})

doctor_reset_password = DoctorViewSet.as_view({
    'post': 'reset_password'
})

doctor_send_message = DoctorViewSet.as_view({
    'post': 'send_message'
})

doctor_stats = DoctorViewSet.as_view({
    'get': 'stats'
})

urlpatterns = [
    path('doctors/', doctor_list, name='doctor-list'),
    path('doctors/<int:pk>/', doctor_detail, name='doctor-detail'),
    path('doctors/<int:pk>/create-credentials/', doctor_create_credentials, name='doctor-create-credentials'),
    path('doctors/<int:pk>/reset-password/', doctor_reset_password, name='doctor-reset-password'),
    path('doctors/<int:pk>/send-message/', doctor_send_message, name='doctor-send-message'),
    path('doctors/stats/', doctor_stats, name='doctor-stats'),
]
```

---

## 🔑 Step 5: Add Authentication & Permissions

**File:** `your_app/permissions.py` (Create this file)

```python
from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allow access only to admin users
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsDoctorOrAdmin(permissions.BasePermission):
    """
    Allow access if user is the doctor or admin
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user or request.user.is_staff
```

**Update views.py:**

```python
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminUser, IsDoctorOrAdmin

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]  # Add permission here
    
    def get_permissions(self):
        """
        Different permissions for different actions
        """
        if self.action in ['create', 'update', 'destroy', 'create_credentials', 'reset_password', 'send_message']:
            # Only admins can modify
            permission_classes = [IsAdminUser]
        else:
            # Anyone authenticated can view
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
```

---

## 📌 Complete URL Mapping

| Operation | Method | URL | View Function | Line |
|-----------|--------|-----|---------------|------|
| List All | GET | `/api/v1/doctors/` | `list()` | Auto |
| Create | POST | `/api/v1/doctors/` | `create()` | 33-52 |
| Get One | GET | `/api/v1/doctors/{id}/` | `retrieve()` | Auto |
| Update | PUT | `/api/v1/doctors/{id}/` | `update()` | 68-89 |
| Delete | DELETE | `/api/v1/doctors/{id}/` | `destroy()` | Auto |
| Credentials | POST | `/api/v1/doctors/{id}/create-credentials/` | `create_credentials()` | 95-135 |
| Reset Pass | POST | `/api/v1/doctors/{id}/reset-password/` | `reset_password()` | 141-165 |
| Message | POST | `/api/v1/doctors/{id}/send-message/` | `send_message()` | 171-214 |
| Stats | GET | `/api/v1/doctors/stats/` | `stats()` | 220-241 |
| Search | GET | `/api/v1/doctors/?search=` | `get_queryset()` | 20-29 |

---

## 🧪 Testing with Postman

### 1. List Doctors
```
GET http://localhost:8000/api/v1/doctors/
Headers: Authorization: Bearer YOUR_TOKEN
```

### 2. Create Doctor
```
POST http://localhost:8000/api/v1/doctors/
Headers: 
  - Authorization: Bearer YOUR_TOKEN
  - Content-Type: application/json

Body:
{
  "username": "dr_john",
  "email": "john@hospital.com",
  "full_name": "Dr. John Smith",
  "specialization": "Cardiology",
  "license_number": "LIC123",
  "phone": "9876543210",
  "hospital": "City Hospital"
}
```

### 3. Update Doctor
```
PUT http://localhost:8000/api/v1/doctors/5/
Headers: 
  - Authorization: Bearer YOUR_TOKEN
  - Content-Type: application/json

Body:
{
  "full_name": "Dr. Updated Name",
  "phone": "9876543212"
}
```

### 4. Create Credentials
```
POST http://localhost:8000/api/v1/doctors/5/create-credentials/
Headers: 
  - Authorization: Bearer YOUR_TOKEN
  - Content-Type: application/json

Body:
{
  "password": "Temp@Pass123"
}
```

### 5. Send Message
```
POST http://localhost:8000/api/v1/doctors/5/send-message/
Headers: 
  - Authorization: Bearer YOUR_TOKEN
  - Content-Type: application/json

Body:
{
  "subject": "Important Notice",
  "message": "Please update your credentials"
}
```

### 6. Delete Doctor
```
DELETE http://localhost:8000/api/v1/doctors/5/
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 📝 Settings Configuration

**File:** `your_project/settings.py`

```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',  # For frontend to access backend
    'your_app',
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# CORS Configuration (Allow frontend to access)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port
    "http://localhost:8080",
]
```

---

## ✅ Quick Summary

### To Add URLs for Each Operation:

1. **Create ViewSet** (views.py)
   - Define methods for each operation
   - Use `@action` decorator for custom endpoints

2. **Create Serializer** (serializers.py)
   - Define which fields to serialize
   - Add validation if needed

3. **Create URLs** (urls.py)
   - Use SimpleRouter (recommended)
   - Register ViewSet with router
   - Include in main urls.py with `/api/v1/` prefix

4. **Test Each URL**
   - Use Postman or cURL
   - Check request body format
   - Verify response format

5. **Configure Settings**
   - Add CORS headers
   - Add REST framework configuration
   - Add authentication classes

---

## 🔄 Complete Code Example (All in One)

Here's the complete minimal setup:

**urls.py (app)**
```python
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import DoctorViewSet

router = SimpleRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')

urlpatterns = [
    path('', include(router.urls)),
]
```

**urls.py (project)**
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('your_app.urls')),
]
```

**views.py (app)**
```python
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def create_credentials(self, request, pk=None):
        # ... implementation
        pass
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        # ... implementation
        pass
```

---

## 🚀 Now All URLs Are Ready!

Your frontend will be able to call all endpoints! 🎉
