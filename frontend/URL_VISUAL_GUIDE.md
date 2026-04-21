# URL Configuration - Visual Guide

## 🏗️ Architecture Overview

```
Frontend (React)                  Backend (Django)
================                  ================

DoctorsList.jsx                   views.py
├── fetchAllDoctors()             └── DoctorViewSet
│   └─→ GET /api/v1/doctors/         ├── list()
│                                    ├── create()
├── createDoctor()                   ├── retrieve()
│   └─→ POST /api/v1/doctors/        ├── update()
│                                    ├── destroy()
├── updateDoctor()                   ├── @action create_credentials()
│   └─→ PUT /api/v1/doctors/{id}/    ├── @action reset_password()
│                                    ├── @action send_message()
├── deleteDoctor()                   └── @action stats()
│   └─→ DELETE /api/v1/doctors/{id}/
│
├── createDoctorCredentials()
│   └─→ POST /api/v1/doctors/{id}/create-credentials/
│
├── sendMessageToDoctor()
│   └─→ POST /api/v1/doctors/{id}/send-message/
│
└── searchDoctors()
    └─→ GET /api/v1/doctors/?search=query
```

---

## 📍 File Structure & Where to Add Code

### Django Backend Structure

```
your_project_name/
│
├── your_project/
│   ├── settings.py
│   └── urls.py              ← EDIT: Add include('your_app.urls')
│
├── your_app/
│   ├── models.py            ← CREATE: Doctor & DoctorMessage models
│   ├── views.py             ← CREATE: DoctorViewSet class
│   ├── serializers.py       ← CREATE: DoctorSerializer
│   ├── urls.py              ← CREATE: Router configuration
│   ├── permissions.py       ← CREATE: Custom permissions
│   └── migrations/
│
└── manage.py

```

---

## 🔢 Step-by-Step URL Setup

### STEP 1: Main Project URLs
**File:** `your_project/urls.py`

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Add this line
    path('api/v1/', include('your_app.urls')),  # ← ADD THIS
]
```

**What it does:** Routes all `/api/v1/` URLs to your app's urls.py

---

### STEP 2: App URLs Configuration
**File:** `your_app/urls.py` (Create this file)

```python
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import DoctorViewSet

# Create router
router = SimpleRouter()

# Register viewset
# This automatically creates all CRUD URLs
router.register(r'doctors', DoctorViewSet, basename='doctor')

app_name = 'doctors'

urlpatterns = [
    path('', include(router.urls)),
]
```

**What it does:** 
- Creates router
- Registers DoctorViewSet
- Automatically generates these URLs:
  ```
  GET    /doctors/              (list)
  POST   /doctors/              (create)
  GET    /doctors/{id}/         (retrieve)
  PUT    /doctors/{id}/         (update)
  DELETE /doctors/{id}/         (destroy)
  ```

---

### STEP 3: Views with Operations
**File:** `your_app/views.py`

```python
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    # ===============================
    # 1. GET /doctors/ (list)
    # 2. POST /doctors/ (create)
    # 3. GET /doctors/{id}/ (retrieve)
    # 4. PUT /doctors/{id}/ (update)
    # 5. DELETE /doctors/{id}/ (destroy)
    # ===============================
    # These are automatically created by ModelViewSet
    
    # ===============================
    # 6. POST /doctors/{id}/create-credentials/
    # ===============================
    @action(detail=True, methods=['post'])
    def create_credentials(self, request, pk=None):
        doctor = self.get_object()
        password = request.data.get('password')
        
        # Create user account
        from django.contrib.auth.models import User
        user, created = User.objects.get_or_create(
            username=doctor.email,
            defaults={'email': doctor.email}
        )
        user.set_password(password)
        user.save()
        
        doctor.user = user
        doctor.credentials_created = True
        doctor.save()
        
        return Response({'username': doctor.email, 'status': 'created'})
    
    # ===============================
    # 7. POST /doctors/{id}/send-message/
    # ===============================
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        doctor = self.get_object()
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        # Save message
        from .models import DoctorMessage
        msg = DoctorMessage.objects.create(
            doctor=doctor,
            subject=subject,
            message=message
        )
        
        return Response({'status': 'sent', 'message_id': msg.id})
    
    # ===============================
    # 8. GET /doctors/stats/ (custom action)
    # ===============================
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Doctor.objects.count()
        active = Doctor.objects.filter(is_active=True).count()
        
        return Response({
            'total_doctors': total,
            'active_doctors': active
        })
```

---

## 📊 Complete URL Mapping Table

| # | Frontend Call | Method | URL | ViewSet Method | @action | Line |
|---|---------------|--------|-----|-----------------|---------|------|
| 1 | fetchAllDoctors() | GET | `/api/v1/doctors/` | list | - | Auto |
| 2 | createDoctor() | POST | `/api/v1/doctors/` | create | - | Auto |
| 3 | fetchDoctorById() | GET | `/api/v1/doctors/5/` | retrieve | - | Auto |
| 4 | updateDoctor() | PUT | `/api/v1/doctors/5/` | update | - | Auto |
| 5 | deleteDoctor() | DELETE | `/api/v1/doctors/5/` | destroy | - | Auto |
| 6 | createDoctorCredentials() | POST | `/api/v1/doctors/5/create-credentials/` | - | create_credentials | Custom |
| 7 | resetDoctorPassword() | POST | `/api/v1/doctors/5/reset-password/` | - | reset_password | Custom |
| 8 | sendMessageToDoctor() | POST | `/api/v1/doctors/5/send-message/` | - | send_message | Custom |
| 9 | getDoctorStats() | GET | `/api/v1/doctors/stats/` | - | stats | Custom |
| 10 | searchDoctors() | GET | `/api/v1/doctors/?search=john` | list | - | Query |

---

## 🔗 How @action Decorator Works

```python
@action(detail=True, methods=['post'])
def create_credentials(self, request, pk=None):
    pass

# This creates the URL:
# POST /api/v1/doctors/{id}/create-credentials/
#       ↑
#       │
#       └─ pk from URL is passed as 'pk' parameter
#
# detail=True means: includes the {id} in URL
# methods=['post'] means: only accepts POST requests
```

---

## 📝 Request/Response Examples

### 1. CREATE DOCTOR
```
REQUEST:
POST /api/v1/doctors/
Content-Type: application/json

{
  "username": "dr_john",
  "email": "john@hospital.com",
  "full_name": "Dr. John Smith",
  "specialization": "Cardiology",
  "phone": "9876543210"
}

RESPONSE:
{
  "id": 1,
  "username": "dr_john",
  "email": "john@hospital.com",
  "full_name": "Dr. John Smith",
  "specialization": "Cardiology",
  "phone": "9876543210",
  "created_at": "2026-04-21T22:00:00Z"
}
```

### 2. UPDATE DOCTOR
```
REQUEST:
PUT /api/v1/doctors/1/
Content-Type: application/json

{
  "full_name": "Dr. John Updated"
}

RESPONSE:
{
  "id": 1,
  "full_name": "Dr. John Updated",
  "email": "john@hospital.com",
  ...
}
```

### 3. CREATE CREDENTIALS
```
REQUEST:
POST /api/v1/doctors/1/create-credentials/
Content-Type: application/json

{
  "password": "Temp@Pass123"
}

RESPONSE:
{
  "username": "john@hospital.com",
  "temporary_password": "Temp@Pass123",
  "message": "Credentials created"
}
```

### 4. SEND MESSAGE
```
REQUEST:
POST /api/v1/doctors/1/send-message/
Content-Type: application/json

{
  "subject": "Important Notice",
  "message": "Please update your profile"
}

RESPONSE:
{
  "id": 123,
  "subject": "Important Notice",
  "sent_at": "2026-04-21T22:00:00Z",
  "status": "sent"
}
```

---

## 🎯 Key Points to Remember

1. **SimpleRouter does the magic**
   - Automatically creates CRUD URLs
   - You only define the ViewSet

2. **@action decorator for custom endpoints**
   - `detail=True` adds `{id}` to URL
   - `detail=False` doesn't add `{id}` to URL
   - Methods list specifies HTTP methods

3. **URL naming convention**
   - Router converts model name to lowercase
   - `Doctor` → `doctors/`
   - Custom action becomes sub-URL
   - `create_credentials` → `create-credentials/`

4. **Query parameters**
   - Add with `?search=value`
   - Access via `request.query_params.get('search')`

5. **Request body**
   - Access via `request.data`
   - Must send `Content-Type: application/json`

---

## 🧪 Test Your URLs

### Using Django Shell
```bash
python manage.py shell
>>> from your_app.models import Doctor
>>> Doctor.objects.create(
...   username='dr_test',
...   email='test@hospital.com',
...   full_name='Dr. Test',
...   specialization='Cardiology',
...   phone='9876543210'
... )
```

### Using Postman
1. Create collection
2. Add requests for each operation
3. Set Authorization header with JWT token
4. Send requests and check responses

### Using cURL
```bash
# List doctors
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/v1/doctors/

# Create doctor
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"dr_new","email":"new@hospital.com"}' \
  http://localhost:8000/api/v1/doctors/
```

---

## ✅ Final Checklist

- [ ] Created `your_app/urls.py` with router
- [ ] Updated `your_project/urls.py` with include
- [ ] Created `your_app/views.py` with DoctorViewSet
- [ ] Created `your_app/serializers.py` with DoctorSerializer
- [ ] Created Doctor model in `models.py`
- [ ] Added `@action` decorators for custom endpoints
- [ ] Configured authentication in settings.py
- [ ] Ran migrations: `python manage.py migrate`
- [ ] Tested each URL with Postman/cURL
- [ ] Verified frontend can connect

---

**All URLs are now ready for your React frontend!** 🚀
