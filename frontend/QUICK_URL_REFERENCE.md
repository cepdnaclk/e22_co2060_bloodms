# Quick URL Reference Card

## 📌 Print This Page!

---

## ⚡ 9 Operations Summary

| # | Operation | Method | URL | Files |
|---|-----------|--------|-----|-------|
| 1 | List All | GET | `/api/v1/doctors/` | views.py |
| 2 | Create | POST | `/api/v1/doctors/` | views.py |
| 3 | Get One | GET | `/api/v1/doctors/{id}/` | Auto |
| 4 | Update | PUT | `/api/v1/doctors/{id}/` | views.py |
| 5 | Delete | DELETE | `/api/v1/doctors/{id}/` | Auto |
| 6 | Credentials | POST | `/api/v1/doctors/{id}/create-credentials/` | @action |
| 7 | Reset Pass | POST | `/api/v1/doctors/{id}/reset-password/` | @action |
| 8 | Message | POST | `/api/v1/doctors/{id}/send-message/` | @action |
| 9 | Stats | GET | `/api/v1/doctors/stats/` | @action |

---

## 📂 5 Files to Create/Update

1. **your_app/models.py** - Doctor & DoctorMessage models
2. **your_app/serializers.py** - DoctorSerializer
3. **your_app/views.py** - DoctorViewSet (all 9 operations)
4. **your_app/urls.py** - Router configuration
5. **your_project/urls.py** - Include app urls

---

## 🔑 Key Code Snippets

### urls.py (project level)
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('your_app.urls')),  # ← ADD THIS
]
```

### urls.py (app level)
```python
from rest_framework.routers import SimpleRouter
router = SimpleRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')
urlpatterns = [path('', include(router.urls))]
```

### views.py (basic structure)
```python
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    @action(detail=True, methods=['post'])
    def create_credentials(self, request, pk=None):
        # Implementation here
        pass
```

---

## 🧪 Test URLs with Postman

### Create Bearer Token First
```
POST /api/v1/token/
{
  "username": "admin",
  "password": "password"
}
```

### Then use token in all requests
```
Header: Authorization: Bearer {your_token}
```

---

## 🚀 Deploy Checklist

- [ ] Created all 5 files
- [ ] Added models to admin.py
- [ ] Ran makemigrations & migrate
- [ ] Installed: djangorestframework, djangorestframework-simplejwt, django-cors-headers
- [ ] Updated settings.py with REST & CORS config
- [ ] Updated main urls.py
- [ ] Test each operation in Postman
- [ ] Verify frontend can connect

---

## 🔧 Common Issues

**Error: No module named 'rest_framework'**
→ `pip install djangorestframework`

**Error: 404 Not Found**
→ Check URL path in router matches front-end call

**Error: 401 Unauthorized**
→ Add Authorization header with JWT token

**Error: 403 Forbidden**
→ Check IsAuthenticated permission in settings.py

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Add frontend URL to CORS_ALLOWED_ORIGINS in settings.py |
| 404 on POST | Check URL path exactly matches router register path |
| Missing fields | Check serializer fields include all required fields |
| Validation error | Check request body format matches model fields |

---

## 💡 Remember

1. **Router automatically creates CRUD URLs**
   - Don't manually create list/create/retrieve/update/destroy

2. **@action decorator for custom URLs**
   - `detail=True` includes {id}
   - Add @action for each custom endpoint

3. **SimpleRouter converts underscores to hyphens**
   - `create_credentials` → `create-credentials/`

4. **All operations return JSON**
   - Content-Type must be application/json

5. **Authentication required**
   - Add JWT token in Authorization header

---

## 📚 All Documentation Files

1. **BACKEND_URL_SETUP.md** - Detailed URL setup
2. **BACKEND_COMPLETE_CODE.md** - Copy-paste ready code
3. **URL_VISUAL_GUIDE.md** - Visual diagrams
4. **This file** - Quick reference

---

**You have everything you need! Start building!** 🚀
