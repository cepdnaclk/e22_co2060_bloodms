# API Endpoints Guide - Frontend Configuration

## 📍 Where API Endpoints Are Defined

All API endpoints are defined in **ONE FILE**:
```
src/api/doctorService.js  (Lines 1-284)
```

## 🔧 Base URL Configuration

**File:** `src/api/doctorService.js` (Line 11)

```javascript
const doctorAPI = axios.create({
  baseURL: 'http://localhost:8000/api/v1',  // ← CHANGE THIS IF YOUR BACKEND URL IS DIFFERENT
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### ⚠️ If Your Backend URL is Different:
Replace `http://localhost:8000/api/v1` with your actual backend URL.

**Examples:**
- Production: `https://api.hopedrop.com/api/v1`
- Different port: `http://localhost:5000/api/v1`
- Docker: `http://backend:8000/api/v1`

---

## 📋 All API Endpoints Used

Here's every endpoint the frontend uses, with line numbers for quick reference:

### 1. **FETCH ALL DOCTORS** ✅
- **File:** `src/api/doctorService.js` (Line 35)
- **Method:** `GET`
- **Endpoint:** `/doctors/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/`
- **Used By:** DoctorsList.jsx (Line 34 - loadDoctors function)
- **Response Expected:**
  ```json
  [
    {
      "id": 1,
      "username": "dr_john",
      "email": "john@hospital.com",
      "full_name": "Dr. John Smith",
      "specialization": "Cardiology",
      "phone": "9876543210",
      "license_number": "LIC123",
      "hospital": "City Hospital",
      "is_active": true,
      "created_at": "2026-04-21T00:00:00Z"
    }
  ]
  ```

---

### 2. **GET SINGLE DOCTOR**
- **File:** `src/api/doctorService.js` (Line 57)
- **Method:** `GET`
- **Endpoint:** `/doctors/{id}/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/5/`
- **Used By:** Optional (currently not used in DoctorsList)

---

### 3. **SEARCH DOCTORS**
- **File:** `src/api/doctorService.js` (Line 79)
- **Method:** `GET`
- **Endpoint:** `/doctors/?search={searchTerm}`
- **Full URL:** `http://localhost:8000/api/v1/doctors/?search=123`
- **Used By:** DoctorsList.jsx (Line 43 - handleSearch)
- **Query Parameters:**
  - `search`: Search term (ID, name, email)
- **Response Expected:** Same as "Fetch All Doctors" but filtered

---

### 4. **CREATE NEW DOCTOR** ✅
- **File:** `src/api/doctorService.js` (Line 113)
- **Method:** `POST`
- **Endpoint:** `/doctors/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/`
- **Used By:** DoctorsList.jsx (AddDoctorModal - Line 305)
- **Request Body:**
  ```json
  {
    "username": "dr_newuser",
    "email": "newuser@hospital.com",
    "full_name": "Dr. New User",
    "specialization": "Cardiology",
    "license_number": "LIC456",
    "phone": "9876543211",
    "hospital": "City Hospital"
  }
  ```
- **Response Expected:**
  ```json
  {
    "id": 2,
    "username": "dr_newuser",
    "email": "newuser@hospital.com",
    "full_name": "Dr. New User",
    "specialization": "Cardiology",
    "license_number": "LIC456",
    "phone": "9876543211",
    "hospital": "City Hospital",
    "is_active": true,
    "created_at": "2026-04-21T00:00:00Z"
  }
  ```

---

### 5. **UPDATE DOCTOR DETAILS** ✅
- **File:** `src/api/doctorService.js` (Line 137)
- **Method:** `PUT`
- **Endpoint:** `/doctors/{id}/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/5/`
- **Used By:** DoctorsList.jsx (AddDoctorModal - Line 318)
- **Request Body:** (Any fields to update)
  ```json
  {
    "full_name": "Dr. Updated Name",
    "phone": "9876543212",
    "specialization": "Neurology",
    "hospital": "New Hospital"
  }
  ```
- **Response Expected:** Updated doctor object
- **⚠️ Notes:**
  - Email and Username should NOT be updated
  - Only mutable fields: full_name, phone, specialization, license_number, hospital

---

### 6. **CREATE LOGIN CREDENTIALS** ✅
- **File:** `src/api/doctorService.js` (Line 164)
- **Method:** `POST`
- **Endpoint:** `/doctors/{id}/create-credentials/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/5/create-credentials/`
- **Used By:** DoctorsList.jsx (Line 69 - handleCreateCredentials)
- **Request Body:**
  ```json
  {
    "password": "Temp@Pass123"
  }
  ```
- **Response Expected:**
  ```json
  {
    "username": "john@hospital.com",
    "temporary_password": "Temp@Pass123",
    "message": "Credentials created. Doctor must change on first login"
  }
  ```

---

### 7. **RESET DOCTOR PASSWORD**
- **File:** `src/api/doctorService.js` (Line 192)
- **Method:** `POST`
- **Endpoint:** `/doctors/{id}/reset-password/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/5/reset-password/`
- **Currently Not Used:** Available for future use
- **Request Body:**
  ```json
  {
    "new_password": "NewPass@123"
  }
  ```

---

### 8. **DELETE DOCTOR** ✅
- **File:** `src/api/doctorService.js` (Line 216)
- **Method:** `DELETE`
- **Endpoint:** `/doctors/{id}/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/5/`
- **Used By:** DoctorsList.jsx (Line 56 - handleDelete, Line 116 - handleBulkDelete)
- **Request Body:** None
- **Response Expected:**
  ```json
  {
    "message": "Doctor deleted successfully"
  }
  ```

---

### 9. **SEND MESSAGE TO DOCTOR** ✅
- **File:** `src/api/doctorService.js` (Line 243)
- **Method:** `POST`
- **Endpoint:** `/doctors/{id}/send-message/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/5/send-message/`
- **Used By:** DoctorsList.jsx (Line 85 - handleSendMessage, Line 113 - handleBulkMessage)
- **Request Body:**
  ```json
  {
    "subject": "Important Notice",
    "message": "Please update your credentials..."
  }
  ```
- **Response Expected:**
  ```json
  {
    "id": 123,
    "subject": "Important Notice",
    "sent_at": "2026-04-21T22:00:00Z",
    "status": "sent"
  }
  ```

---

### 10. **GET DOCTOR STATISTICS (Optional)**
- **File:** `src/api/doctorService.js` (Line 268)
- **Method:** `GET`
- **Endpoint:** `/doctors/stats/`
- **Full URL:** `http://localhost:8000/api/v1/doctors/stats/`
- **Currently Not Used:** Available for dashboard statistics
- **Response Expected:**
  ```json
  {
    "total_doctors": 10,
    "active_doctors": 8,
    "inactive_doctors": 2,
    "by_specialization": {
      "Cardiology": 3,
      "Neurology": 2
    }
  }
  ```

---

## 🔍 Quick Reference Table

| Operation | Method | Endpoint | File Line | Component Line |
|-----------|--------|----------|-----------|-----------------|
| List Doctors | GET | `/doctors/` | 35 | DoctorsList:34 |
| Get One Doctor | GET | `/doctors/{id}/` | 57 | - |
| Search Doctors | GET | `/doctors/?search=` | 79 | DoctorsList:43 |
| Create Doctor | POST | `/doctors/` | 113 | AddDoctorModal:305 |
| Update Doctor | PUT | `/doctors/{id}/` | 137 | AddDoctorModal:318 |
| Create Credentials | POST | `/doctors/{id}/create-credentials/` | 164 | DoctorsList:69 |
| Reset Password | POST | `/doctors/{id}/reset-password/` | 192 | - |
| Delete Doctor | DELETE | `/doctors/{id}/` | 216 | DoctorsList:56 |
| Send Message | POST | `/doctors/{id}/send-message/` | 243 | DoctorsList:85 |
| Get Stats | GET | `/doctors/stats/` | 268 | - |

---

## 🛠️ How to Update Endpoints

### If Your Backend Endpoints Are DIFFERENT:

#### Step 1: Edit `src/api/doctorService.js`

**Example 1: If your create endpoint is different**

Current:
```javascript
// Line 113
export const createDoctor = async (doctorData) => {
  const response = await doctorAPI.post('/doctors/', doctorData);
```

If your backend uses `/api/doctors/register/` instead:
```javascript
export const createDoctor = async (doctorData) => {
  const response = await doctorAPI.post('/api/doctors/register/', doctorData);
```

**Example 2: If your credentials endpoint is different**

Current:
```javascript
// Line 164
const response = await doctorAPI.post(`/doctors/${doctorId}/create-credentials/`, {
```

If your backend uses `/doctors/{id}/set-password/`:
```javascript
const response = await doctorAPI.post(`/doctors/${doctorId}/set-password/`, {
```

---

## 📝 Authentication Token Handling

**File:** `src/api/doctorService.js` (Lines 4-26)

The frontend automatically adds JWT token to all requests:

```javascript
// Lines 18-26
doctorAPI.interceptors.request.use((config) => {
  const token = getAuthToken();  // Gets from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Adds to header
  }
  return config;
}, ...);
```

**⚠️ Token Source:** `localStorage.getItem('authTokens')`

Make sure your login API stores the token here with this structure:
```javascript
localStorage.setItem('authTokens', JSON.stringify({
  access: 'your_jwt_token_here',
  refresh: 'refresh_token_if_needed'
}));
```

---

## ✅ What You Need to Create in Django Backend

Create these endpoints in your Django REST API:

```python
# urls.py or router configuration

# Doctor CRUD
GET    /api/v1/doctors/                          → List all
GET    /api/v1/doctors/?search=query             → Search
GET    /api/v1/doctors/{id}/                     → Get single
POST   /api/v1/doctors/                          → Create
PUT    /api/v1/doctors/{id}/                     → Update
DELETE /api/v1/doctors/{id}/                     → Delete

# Special Operations
POST   /api/v1/doctors/{id}/create-credentials/  → Create login
POST   /api/v1/doctors/{id}/reset-password/      → Reset password
POST   /api/v1/doctors/{id}/send-message/        → Send message
GET    /api/v1/doctors/stats/                    → Stats (optional)
```

---

## 🧪 Testing Endpoints

### Using cURL:

```bash
# List doctors
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/doctors/

# Search doctors
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/v1/doctors/?search=123"

# Create doctor
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"dr_new","email":"new@hospital.com","full_name":"Dr. New"}' \
  http://localhost:8000/api/v1/doctors/

# Create credentials
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password":"Temp@Pass123"}' \
  http://localhost:8000/api/v1/doctors/5/create-credentials/

# Delete doctor
curl -X DELETE -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/doctors/5/
```

### Using Postman:

1. Import the endpoints
2. Add header: `Authorization: Bearer {your_token}`
3. Test each endpoint
4. Copy exact URLs and method names

---

## 🎯 Summary: Places to Update

| Location | File | Line | What to Change |
|----------|------|------|-----------------|
| Base URL | `src/api/doctorService.js` | 11 | `baseURL` value |
| Any endpoint | `src/api/doctorService.js` | 35, 79, 113, 137, 164, 192, 216, 243, 268 | Endpoint paths |
| Token key | `src/api/doctorService.js` | 6, 21 | `localStorage.getItem()` key |

**IMPORTANT:** 
- Only edit `src/api/doctorService.js` for endpoint changes
- Don't change anything in `DoctorsList.jsx` or `AddDoctorModal`
- The component files automatically use the functions from `doctorService.js`

---

## 🔐 Error Handling

All API functions return a consistent format:

```javascript
{
  success: true/false,
  data: { ... } or null,
  message: "Error message from backend or generic message",
  errors: { ... } // Validation errors if any
}
```

**Example Response on Error:**
```javascript
{
  success: false,
  data: null,
  message: "Failed to create doctor",
  errors: {
    "email": ["Email already exists"],
    "username": ["Username must be unique"]
  }
}
```

The frontend displays these errors to the user automatically.

---

**Everything is ready! Once you create these endpoints in Django, it will work perfectly.** ✅
