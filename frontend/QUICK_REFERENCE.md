# Quick Reference - Doctor Management System

## 🎯 6 Features at a Glance

### 1️⃣ Complete AddDoctor (Uncommented)
```
✅ createDoctor() now called when form submitted
✅ Form validation with error messages
✅ Displays errors under each field
✅ Shows success/failure alerts
```
**Line:** `src/pages/admin/DoctorsList.jsx` → Line 305-320

---

### 2️⃣ Edit Doctor
```
✅ Click edit icon → form pre-fills with doctor data
✅ Email & Username fields disabled
✅ Shows "Update Doctor" button instead of "Add"
✅ Calls updateDoctor() instead of createDoctor()
✅ Table refreshes after update
```
**Lines:** Line 152-155, 286-413, 162-165

---

### 3️⃣ Pagination
```
✅ Shows 10 doctors per page
✅ Previous/Next buttons
✅ Page number buttons (1, 2, 3...)
✅ Shows "Page X of Y | Total: Z"
✅ Resets to page 1 on filter/search change
```
**Lines:** Line 20-21, 150-161, 276-313

---

### 4️⃣ Sorting
```
✅ Sort by: Name, Email, Date Created
✅ Sort order: Ascending, Descending
✅ Updates instantly when changed
✅ Works with filtered data
```
**Lines:** Line 22-23, 97-140, 245-262

---

### 5️⃣ Filtering
```
✅ Filter by Specialization
✅ Filter by Hospital
✅ Filter by Status (Active/Inactive)
✅ Clear Filters button
✅ Dropdowns auto-populate with unique values
```
**Lines:** Line 25-28, 141-150, 230-277

---

### 6️⃣ Bulk Actions
```
✅ Checkboxes for each doctor
✅ "Select All" in header
✅ Shows "X doctor(s) selected" bar
✅ Bulk Delete with confirmation
✅ Bulk Message with prompt
✅ Export CSV button
```
**Lines:** Line 29, 145-177, 179-200, 263-271, 313-330

---

## 📊 Feature Comparison Table

| Feature | Lines | State Vars | Functions | CSS |
|---------|-------|-----------|-----------|-----|
| Create/Edit | 305-413 | editingDoctor | validateForm, handleSubmit | form-group, error-text |
| Pagination | 150-313 | currentPage, itemsPerPage | getPaginatedData, getTotalPages | pagination, page-numbers |
| Sorting | 97-262 | sortBy, sortOrder | applyFiltersAndSort | sorting-container |
| Filtering | 54-277 | filters, showFilters | getUniqueSpecializations, getUniqueHospitals | filters-container |
| Bulk Actions | 29-330 | selectedDoctors | handleSelectDoctor, handleSelectAll, handleBulkDelete, handleBulkMessage | bulk-actions |

---

## 🔄 Control Flow Diagrams

### Create Doctor Flow
```
User clicks "Add New Doctor"
    ↓
AddDoctorModal opens (empty form)
    ↓
User fills form + clicks "Add Doctor"
    ↓
validateForm() checks fields
    ↓
createDoctor(formData) → POST /api/v1/doctors/
    ↓
Backend creates doctor
    ↓
Alert: "Doctor added successfully"
    ↓
loadDoctors() refreshes table
    ↓
Modal closes
```

### Edit Doctor Flow
```
User clicks Edit icon
    ↓
handleEditClick(doctor) sets editingDoctor
    ↓
AddDoctorModal opens (form pre-filled)
    ↓
Email & Username fields disabled
    ↓
User modifies allowed fields + clicks "Update Doctor"
    ↓
validateForm() checks fields
    ↓
updateDoctor(id, formData) → PUT /api/v1/doctors/5/
    ↓
Backend updates doctor
    ↓
Alert: "Doctor updated successfully"
    ↓
loadDoctors() refreshes table
    ↓
Modal closes
```

### Filter + Sort + Paginate Flow
```
User applies filter/sort/search
    ↓
State updated: setFilters(), setSortBy(), setSearchTerm()
    ↓
useEffect triggered (dependency: doctors, filters, sortBy, sortOrder)
    ↓
applyFiltersAndSort() runs:
  1. Filter by specialization/hospital/status
  2. Filter by search term
  3. Sort by name/email/date
  4. Ascending or descending
    ↓
setFilteredDoctors(result)
    ↓
setCurrentPage(1) reset to first page
    ↓
Component re-renders
    ↓
getPaginatedData() shows first 10 items
    ↓
Table displays filtered, sorted, paginated data
```

### Bulk Delete Flow
```
User selects checkboxes (multiple doctors)
    ↓
Bulk actions bar appears
    ↓
Click "Delete Selected"
    ↓
window.confirm("Delete X doctor(s)?")
    ↓
For each selected doctor:
  deleteDoctor(id) → DELETE /api/v1/doctors/id/
    ↓
All delete requests complete
    ↓
setSelectedDoctors([]) clear selection
    ↓
loadDoctors() refresh table
```

---

## 🛠️ Customization Guide

### Change Items Per Page
```javascript
// File: src/pages/admin/DoctorsList.jsx
// Line 21 - Change 10 to any number
const [itemsPerPage] = useState(10);  // Change to 20, 50, etc.
```

### Add New Filter
```javascript
// 1. Add to filters state (Line 25-28)
const [filters, setFilters] = useState({
  specialization: '',
  hospital: '',
  status: '',
  newFilter: '',  // ADD HERE
});

// 2. Add filter logic in applyFiltersAndSort() (Line 54-96)
if (filters.newFilter) {
  result = result.filter(d => d.newFilter === filters.newFilter);
}

// 3. Add UI in filters panel (Line 230-277)
<div className="filter-group">
  <label>New Filter</label>
  <select
    value={filters.newFilter}
    onChange={(e) => setFilters({...filters, newFilter: e.target.value})}
  >
    <option value="">All</option>
    {/* options */}
  </select>
</div>
```

### Change Default Sort
```javascript
// File: src/pages/admin/DoctorsList.jsx
// Line 22-23 - Change defaults
const [sortBy, setSortBy] = useState('email');  // Change to email or date
const [sortOrder, setSortOrder] = useState('desc');  // Change to desc
```

### Disable Edit for Specific Fields
```javascript
// File: src/pages/admin/DoctorsList.jsx
// In AddDoctorModal component
// Add disabled={editingDoctor ? true : false} to any field you want to disable
<input
  type="text"
  name="phone"
  disabled={editingDoctor ? true : false}  // Disable phone if editing
/>
```

---

## 🐛 Common Issues & Solutions

### Issue: Edit button doesn't work
**Solution:** Check `handleEditClick()` is being called
```javascript
// Line 162-165 should be:
<button onClick={() => handleEditClick(doctor)}>
  <Edit2 size={16} />
</button>
```

### Issue: Pagination buttons don't show
**Solution:** Check if `getTotalPages() > 1`
```javascript
// Line 275 - Will only show if multiple pages
{getTotalPages() > 1 && (
  <div className="pagination">
    {/* buttons */}
  </div>
)}
```

### Issue: Filter dropdown is empty
**Solution:** Check if backend returns unique values
```javascript
// Line 141-150
// These functions extract unique values from doctor list
const getUniqueSpecializations = () => {
  return [...new Set(doctors.map(d => d.specialization).filter(Boolean))];
};
```

### Issue: Checkboxes not appearing
**Solution:** Check table header has checkbox column
```javascript
// Line 317 - Header must have checkbox
<th>
  <input type="checkbox" onChange={handleSelectAll} />
</th>

// Line 325 - Each row must have checkbox
<td>
  <input type="checkbox" checked={...} onChange={...} />
</td>
```

### Issue: Bulk actions bar not showing
**Solution:** Check `selectedDoctors.length > 0`
```javascript
// Line 263 - Will only show if doctors selected
{selectedDoctors.length > 0 && (
  <div className="bulk-actions">
    {/* buttons */}
  </div>
)}
```

---

## 📱 Responsive Design

### Desktop View (1024px+)
```
┌─ Header with multiple buttons ─┐
├─ Search bar                     │
├─ Filters panel (4 columns)      │
├─ Sort controls                  │
├─ Bulk actions bar               │
├─ Table (10 items)               │
└─ Pagination (bottom)            │
```

### Tablet View (768px - 1024px)
```
┌─ Header (buttons wrap) ─┐
├─ Search bar             │
├─ Filters (2 columns)    │
├─ Sort controls          │
├─ Bulk actions bar       │
├─ Table (scrollable)     │
└─ Pagination             │
```

### Mobile View (<768px)
```
┌─ Header (buttons wrap) ─┐
├─ Search bar             │
├─ Filters (1 column)     │
├─ Sort controls          │
├─ Bulk actions bar       │
├─ Table (horizontal scroll)
└─ Pagination (compact)   │
```

---

## 📞 API Endpoints Used

```
GET    /api/v1/doctors/                 → Fetch all
GET    /api/v1/doctors/?search=         → Search
POST   /api/v1/doctors/                 → Create
PUT    /api/v1/doctors/{id}/            → Update
DELETE /api/v1/doctors/{id}/            → Delete
POST   /api/v1/doctors/{id}/create-credentials/
POST   /api/v1/doctors/{id}/send-message/
```

See `API_ENDPOINTS_GUIDE.md` for complete details.

---

## 📚 File References

| Task | File | Line |
|------|------|------|
| Add/Edit Doctor | DoctorsList.jsx | 305-413 |
| Pagination | DoctorsList.jsx | 150-313 |
| Sorting | DoctorsList.jsx | 22-23, 97-262 |
| Filtering | DoctorsList.jsx | 25-28, 54-277 |
| Bulk Actions | DoctorsList.jsx | 29, 145-330 |
| CSS Styling | DoctorsList.css | 368-492 |
| API Calls | doctorService.js | 35-243 |

---

## ✅ Verification Checklist

After implementation, verify:

- [ ] Page loads without errors
- [ ] Doctors table displays
- [ ] Search works
- [ ] Filters appear when click Filter button
- [ ] Sorting works
- [ ] Pagination shows when > 10 doctors
- [ ] Edit button opens modal with data pre-filled
- [ ] Email & Username disabled in edit mode
- [ ] "Update Doctor" button shows in edit mode
- [ ] Add button still works for new doctors
- [ ] Checkboxes work
- [ ] Select All checkbox works
- [ ] Bulk actions bar shows when selected
- [ ] Bulk delete works with confirmation
- [ ] Bulk message works with prompts
- [ ] Export CSV button downloads file
- [ ] Responsive on mobile/tablet

---

**All features ready to use! 🚀**
