# Backend Implementation - Complete Code for Each Operation

## 📋 Copy-Paste Ready Code

Below is the exact code you need to add to your Django backend for each operation.

---

## 🗂️ File 1: Models (your_app/models.py)

```python
from django.db import models
from django.contrib.auth.models import User

class Doctor(models.Model):
    """Doctor Profile Model"""
    
    # Authentication
    user = models.OneToOneField(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='doctor_profile'
    )
    
    # Basic Information
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    
    # Professional Information
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=100, unique=True)
    hospital = models.CharField(max_length=255, blank=True, null=True)
    
    # Status Fields
    is_active = models.BooleanField(default=True)
    credentials_created = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'
    
    def __str__(self):
        return self.full_name


class DoctorMessage(models.Model):
    """Messages sent to doctors by admin"""
    
    doctor = models.ForeignKey(
        Doctor, 
        on_delete=models.CASCADE, 
        related_name='messages'
    )
    sent_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='sent_messages'
    )
    
    subject = models.CharField(max_length=255)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Doctor Message'
        verbose_name_plural = 'Doctor Messages'
    
    def __str__(self):
        return f"{self.subject} - {self.doctor.full_name}"
```

**After adding this, run:**
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 🗂️ File 2: Serializers (your_app/serializers.py)

```python
from rest_framework import serializers
from .models import Doctor, DoctorMessage

class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for Doctor model - converts model to JSON"""
    
    class Meta:
        model = Doctor
        fields = [
            'id',
            'username',
            'email',
            'full_name',
            'phone',
            'specialization',
            'license_number',
            'hospital',
            'is_active',
            'credentials_created',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'id']
        extra_kwargs = {
            'username': {
                'required': True,
                'min_length': 3
            },
            'email': {
                'required': True
            },
            'full_name': {
                'required': True
            },
            'phone': {
                'required': True
            },
            'specialization': {
                'required': True
            }
        }
    
    def validate_email(self, value):
        """Validate email is unique"""
        if Doctor.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_username(self, value):
        """Validate username is unique"""
        if Doctor.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value


class DoctorMessageSerializer(serializers.ModelSerializer):
    """Serializer for DoctorMessage model"""
    
    class Meta:
        model = DoctorMessage
        fields = ['id', 'doctor', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['created_at', 'id']
```

---

## 🗂️ File 3: Views (your_app/views.py)

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Doctor, DoctorMessage
from .serializers import DoctorSerializer, DoctorMessageSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Doctor operations
    Provides CRUD operations and custom actions for doctor management
    """
    
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    
    # ========================================
    # OPERATION 1: GET ALL DOCTORS
    # GET /api/v1/doctors/
    # GET /api/v1/doctors/?search=john
    # ========================================
    def get_queryset(self):
        """
        Filter doctors based on query parameters
        Supports search by ID, name, or email
        """
        queryset = Doctor.objects.all()
        
        # Get search parameter from URL
        search_term = self.request.query_params.get('search', None)
        
        if search_term:
            # Search in ID, full_name, or email
            queryset = queryset.filter(
                Q(id__icontains=search_term) |
                Q(full_name__icontains=search_term) |
                Q(email__icontains=search_term)
            )
        
        return queryset
    
    # ========================================
    # OPERATION 2: CREATE DOCTOR
    # POST /api/v1/doctors/
    # ========================================
    def create(self, request, *args, **kwargs):
        """
        Create a new doctor
        
        Request body:
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
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    # ========================================
    # OPERATION 3: GET SINGLE DOCTOR
    # GET /api/v1/doctors/{id}/
    # ========================================
    # Automatically handled by ModelViewSet
    # Just access: GET /api/v1/doctors/5/
    
    # ========================================
    # OPERATION 4: UPDATE DOCTOR
    # PUT /api/v1/doctors/{id}/
    # ========================================
    def update(self, request, *args, **kwargs):
        """
        Update doctor details
        
        Request body (any fields to update):
        {
            "full_name": "Dr. Updated Name",
            "phone": "9876543212",
            "specialization": "Neurology"
        }
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_update(serializer)
        return Response(serializer.data)
    
    # ========================================
    # OPERATION 5: DELETE DOCTOR
    # DELETE /api/v1/doctors/{id}/
    # ========================================
    # Automatically handled by ModelViewSet
    # Just call: DELETE /api/v1/doctors/5/
    
    # ========================================
    # OPERATION 6: CREATE CREDENTIALS
    # POST /api/v1/doctors/{id}/create-credentials/
    # ========================================
    @action(detail=True, methods=['post'])
    def create_credentials(self, request, pk=None):
        """
        Create login credentials for a doctor
        Creates a Django User account with the doctor's email as username
        
        Request body:
        {
            "password": "Temp@Pass123"
        }
        """
        doctor = self.get_object()
        password = request.data.get('password')
        
        # Validate password is provided
        if not password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create or get User account
            user, created = User.objects.get_or_create(
                username=doctor.email,  # Username = email
                defaults={
                    'email': doctor.email,
                    'first_name': doctor.full_name.split()[0],
                    'last_name': ' '.join(doctor.full_name.split()[1:])
                }
            )
            
            # Set password
            user.set_password(password)
            user.save()
            
            # Link user to doctor
            doctor.user = user
            doctor.credentials_created = True
            doctor.save()
            
            return Response({
                'username': doctor.email,
                'temporary_password': password,
                'message': 'Credentials created. Doctor must change password on first login',
                'credentials_created': True,
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # ========================================
    # OPERATION 7: RESET PASSWORD
    # POST /api/v1/doctors/{id}/reset-password/
    # ========================================
    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """
        Reset doctor's password
        
        Request body:
        {
            "new_password": "NewPass@123"
        }
        """
        doctor = self.get_object()
        new_password = request.data.get('new_password')
        
        # Validate new password
        if not new_password:
            return Response(
                {'error': 'New password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if doctor has user account
        if not doctor.user:
            return Response(
                {'error': 'Doctor has no user account. Create credentials first.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Reset password
            doctor.user.set_password(new_password)
            doctor.user.save()
            
            return Response({
                'message': 'Password reset successfully',
                'username': doctor.email
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # ========================================
    # OPERATION 8: SEND MESSAGE
    # POST /api/v1/doctors/{id}/send-message/
    # ========================================
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Send message to doctor
        Admin can send notifications/messages to doctors
        
        Request body:
        {
            "subject": "Important Notice",
            "message": "Please update your credentials by Friday"
        }
        """
        doctor = self.get_object()
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        # Validate input
        if not subject or not message:
            return Response(
                {'error': 'Subject and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create message record
            doctor_message = DoctorMessage.objects.create(
                doctor=doctor,
                sent_by=request.user,
                subject=subject,
                message=message
            )
            
            # TODO: Send email to doctor (optional)
            # from django.core.mail import send_mail
            # send_mail(
            #     subject,
            #     message,
            #     'noreply@hopedrop.com',
            #     [doctor.email],
            #     fail_silently=False,
            # )
            
            return Response({
                'id': doctor_message.id,
                'doctor': doctor.id,
                'subject': doctor_message.subject,
                'message': doctor_message.message,
                'sent_at': doctor_message.created_at.isoformat(),
                'status': 'sent'
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # ========================================
    # OPERATION 9: GET STATISTICS
    # GET /api/v1/doctors/stats/
    # ========================================
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get statistics about doctors
        Returns total, active, inactive doctors
        """
        try:
            total = Doctor.objects.count()
            active = Doctor.objects.filter(is_active=True).count()
            inactive = Doctor.objects.filter(is_active=False).count()
            
            # Count by specialization
            specializations = {}
            for doc in Doctor.objects.values('specialization').distinct():
                spec = doc.get('specialization')
                if spec:
                    count = Doctor.objects.filter(specialization=spec).count()
                    specializations[spec] = count
            
            # Count by hospital
            hospitals = {}
            for doc in Doctor.objects.values('hospital').distinct():
                hosp = doc.get('hospital')
                if hosp:
                    count = Doctor.objects.filter(hospital=hosp).count()
                    hospitals[hosp] = count
            
            return Response({
                'total_doctors': total,
                'active_doctors': active,
                'inactive_doctors': inactive,
                'by_specialization': specializations,
                'by_hospital': hospitals
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
```

---

## 🗂️ File 4: URLs (your_app/urls.py)

```python
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import DoctorViewSet

# Create router
router = SimpleRouter()

# Register DoctorViewSet
# This automatically creates all CRUD URLs
router.register(r'doctors', DoctorViewSet, basename='doctor')

app_name = 'doctors'

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
]

# Generated URLs:
# GET    /doctors/                         - List all
# POST   /doctors/                         - Create
# GET    /doctors/{id}/                    - Retrieve
# PUT    /doctors/{id}/                    - Update
# DELETE /doctors/{id}/                    - Delete
# POST   /doctors/{id}/create-credentials/ - Create credentials
# POST   /doctors/{id}/reset-password/     - Reset password
# POST   /doctors/{id}/send-message/       - Send message
# GET    /doctors/stats/                   - Get stats
```

---

## 🗂️ File 5: Main Project URLs (your_project/urls.py)

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Include app URLs with /api/v1/ prefix
    path('api/v1/', include('your_app.urls')),  # ← ADD THIS LINE
    
    # Include other apps as needed
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## 🗂️ File 6: Settings (your_project/settings.py)

Add these configurations:

```python
# ============================================
# REST Framework Configuration
# ============================================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
}

# ============================================
# CORS Configuration
# Allow frontend to access backend
# ============================================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# ============================================
# JWT Configuration
# ============================================
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# ============================================
# Add to INSTALLED_APPS
# ============================================
INSTALLED_APPS = [
    # Default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Your app
    'your_app',
]

# ============================================
# Add to MIDDLEWARE
# ============================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Add this
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

---

## 🚀 Installation Steps

### 1. Install Required Packages
```bash
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
```

### 2. Add to requirements.txt
```
Django>=4.0
djangorestframework>=3.14.0
djangorestframework-simplejwt>=5.0.0
django-cors-headers>=3.0.0
```

### 3. Create Django App (if you don't have one)
```bash
python manage.py startapp your_app
```

### 4. Copy Code Files
- Create `your_app/models.py` → Copy File 1
- Create `your_app/serializers.py` → Copy File 2
- Create `your_app/views.py` → Copy File 3
- Create `your_app/urls.py` → Copy File 4
- Edit `your_project/urls.py` → Use File 5
- Edit `your_project/settings.py` → Use File 6

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Admin User (Optional)
```bash
python manage.py createsuperuser
```

### 7. Test the API
```bash
python manage.py runserver
# Visit: http://localhost:8000/api/v1/doctors/
```

---

## ✅ Verification Checklist

- [ ] All files created/updated
- [ ] Installed required packages
- [ ] Ran migrations
- [ ] No errors on runserver
- [ ] Can access `/api/v1/doctors/` in browser
- [ ] Can authenticate with JWT token
- [ ] All 9 operations working in Postman

---

**Everything is ready to integrate with your React frontend!** 🎉
