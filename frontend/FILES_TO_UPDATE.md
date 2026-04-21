# Files to Update - API Endpoints Quick Guide

## 🎯 The ONLY File You Need to Edit

```
src/api/doctorService.js
```

This is where **ALL API endpoints** are defined. No other files need endpoint changes.

---

## 📍 Line-by-Line: What to Update

### 1. **BASE URL** (Line 11)
```javascript
const doctorAPI = axios.create({
  baseURL: 'http://localhost:8000/api/v1',  ← UPDATE THIS
  headers: {
    'Content-Type': 'application/json',
  },
});
```
**Change to:** Your Django backend URL  
**Example:** `https://api.hopedrop.com/api/v1`

---

### 2. **FETCH ALL DOCTORS** (Line 35)
```javascript
const response = await doctorAPI.get('/doctors/');  ← IF DIFFERENT, UPDATE THIS
```
**If your endpoint is:** `/api/doctors/list/`  
**Change to:** 
```javascript
const response = await doctorAPI.get('/api/doctors/list/');
```

---

### 3. **SEARCH DOCTORS** (Line 79)
```javascript
const response = await doctorAPI.get('/doctors/', {  ← ENDPOINT
  params: { search: searchTerm },
});
```
**If different, update** `/doctors/`

---

### 4. **CREATE DOCTOR** (Line 113) ✅ IMPORTANT
```javascript
const response = await doctorAPI.post('/doctors/', doctorData);  ← UPDATE IF DIFFERENT
```
**If your endpoint is:** `/doctors/register/`  
**Change to:**
```javascript
const response = await doctorAPI.post('/doctors/register/', doctorData);
```

---

### 5. **UPDATE DOCTOR** (Line 137) ✅ IMPORTANT
```javascript
const response = await doctorAPI.put(`/doctors/${doctorId}/`, updateData);  ← UPDATE IF DIFFERENT
```
**If different, change** `/doctors/${doctorId}/`

---

### 6. **CREATE CREDENTIALS** (Line 164) ✅ IMPORTANT
```javascript
const response = await doctorAPI.post(`/doctors/${doctorId}/create-credentials/`, {  ← UPDATE IF DIFFERENT
  password,
});
```
**If your endpoint is:** `/doctors/{id}/set-password/`  
**Change to:**
```javascript
const response = await doctorAPI.post(`/doctors/${doctorId}/set-password/`, {
  password,
});
```

---

### 7. **RESET PASSWORD** (Line 192)
```javascript
const response = await doctorAPI.post(`/doctors/${doctorId}/reset-password/`, {  ← UPDATE IF DIFFERENT
  new_password: newPassword,
});
```

---

### 8. **DELETE DOCTOR** (Line 216)
```javascript
const response = await doctorAPI.delete(`/doctors/${doctorId}/`);  ← UPDATE IF DIFFERENT
```

---

### 9. **SEND MESSAGE** (Line 243)
```javascript
const response = await doctorAPI.post(`/doctors/${doctorId}/send-message/`, {  ← UPDATE IF DIFFERENT
  subject,
  message,
});
```

---

### 10. **GET STATS** (Line 268)
```javascript
const response = await doctorAPI.get('/doctors/stats/');  ← UPDATE IF DIFFERENT (OPTIONAL)
```

---

## 🔄 Three Scenarios

### Scenario 1: Your Endpoint Matches Frontend 
✅ **No changes needed!**
```
Frontend expects: /doctors/
Your backend has: /doctors/
→ Ready to use!
```

### Scenario 2: Your Endpoint is Different Path
❌ Need to update  
```
Frontend expects: /doctors/
Your backend has: /api/doctor/list/
→ Change Line 35 from '/doctors/' to '/api/doctor/list/'
```

### Scenario 3: Your Endpoint has Dynamic ID
✅ This is already handled  
```
Frontend: `/doctors/${doctorId}/create-credentials/`
Your backend: `/doctors/5/create-credentials/`
→ The {doctorId} is automatically replaced!
```

---

## 📋 Complete Endpoint Mapping

| Function | Current Path | Your Path | Line to Update |
|----------|--------------|-----------|-----------------|
| fetchAllDoctors | `/doctors/` | ____________ | 35 |
| searchDoctors | `/doctors/?search=` | ____________ | 79 |
| createDoctor | `/doctors/` | ____________ | 113 |
| updateDoctor | `/doctors/{id}/` | ____________ | 137 |
| createDoctorCredentials | `/doctors/{id}/create-credentials/` | ____________ | 164 |
| resetDoctorPassword | `/doctors/{id}/reset-password/` | ____________ | 192 |
| deleteDoctor | `/doctors/{id}/` | ____________ | 216 |
| sendMessageToDoctor | `/doctors/{id}/send-message/` | ____________ | 243 |
| getDoctorStats | `/doctors/stats/` | ____________ | 268 |

**Fill in** "Your Path" column with your actual Django backend endpoints.

---

## ✅ Checklist

- [ ] Know your Django backend URL (e.g., localhost:8000, production URL)
- [ ] Know the base API path (e.g., /api/v1, /api, /backend)
- [ ] Know each endpoint path
- [ ] Update Line 11 with base URL
- [ ] Update each endpoint line if different
- [ ] Test one endpoint to verify it works

---

## 🧪 Quick Test

After updating endpoints, test with your browser console:

```javascript
// Copy and paste in browser console while on admin doctors page:

import { fetchAllDoctors } from './src/api/doctorService.js';

fetchAllDoctors().then(result => {
  console.log('Success:', result.success);
  console.log('Data:', result.data);
  console.log('Message:', result.message);
});
```

If you see doctors data → ✅ Working!  
If you see error → ❌ Update endpoint in doctorService.js

---

## 📞 Common Issues

### Issue: 404 Not Found
```
→ Endpoint path is wrong
→ Update the path in doctorService.js
```

### Issue: 401 Unauthorized
```
→ Token not being sent
→ Check localStorage has 'authTokens' key
→ Check token is valid and not expired
```

### Issue: CORS Error
```
→ Backend not allowing frontend domain
→ Add to Django CORS_ALLOWED_ORIGINS
```

### Issue: Validation Error (400)
```
→ Required fields missing or wrong format
→ Check request body matches backend requirements
→ Check error message in response
```

---

**That's it! Only edit `src/api/doctorService.js` for API changes.** 🎉
