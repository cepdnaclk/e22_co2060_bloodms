import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, MessageSquare, Plus, Search, Eye, EyeOff, Download, Send, Filter } from 'lucide-react';
import {
  fetchAllDoctors,
  searchDoctors,
  deleteDoctor,
  createDoctorCredentials,
  sendMessageToDoctor,
  createDoctor,
  updateDoctor,
} from '../../api/doctorService';
import './DoctorsList.css';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Sorting
  const [sortBy, setSortBy] = useState('name'); // 'name', 'email', 'date'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  
  // Filtering
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialization: '',
    hospital: '',
    status: '', // 'active', 'inactive', ''
  });
  
  // Bulk actions
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  
  // Edit mode
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Load all doctors on mount
  useEffect(() => {
    loadDoctors();
  }, []);
  
  // Apply sorting and filtering whenever doctors change
  useEffect(() => {
    applyFiltersAndSort();
  }, [doctors, filters, sortBy, sortOrder]);

  // Load doctors from backend
  const loadDoctors = async () => {
    setLoading(true);
    const result = await fetchAllDoctors();
    if (result.success) {
      setDoctors(result.data);
      setFilteredDoctors(result.data);
    }
    setLoading(false);
  };

  // Apply filters and sorting
  const applyFiltersAndSort = () => {
    let result = [...doctors];
    
    // Apply filters
    if (filters.specialization) {
      result = result.filter(d => d.specialization === filters.specialization);
    }
    if (filters.hospital) {
      result = result.filter(d => d.hospital === filters.hospital);
    }
    if (filters.status) {
      result = result.filter(d => 
        filters.status === 'active' ? d.is_active : !d.is_active
      );
    }
    
    // Apply search
    if (searchTerm.trim() !== '') {
      result = result.filter(d => 
        d.id.toString().includes(searchTerm) ||
        d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.full_name.localeCompare(b.full_name);
          break;
        case 'email':
          compareValue = a.email.localeCompare(b.email);
          break;
        case 'date':
          compareValue = new Date(a.created_at) - new Date(b.created_at);
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
    
    setFilteredDoctors(result);
    setCurrentPage(1); // Reset to first page
  };
  
  // Search doctors by ID
  const handleSearch = async (term) => {
    setSearchTerm(term);
  };
  
  // Get unique values for filter dropdowns
  const getUniqueSpecializations = () => {
    return [...new Set(doctors.map(d => d.specialization).filter(Boolean))];
  };
  
  const getUniqueHospitals = () => {
    return [...new Set(doctors.map(d => d.hospital).filter(Boolean))];
  };

  // Pagination
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDoctors.slice(startIndex, endIndex);
  };
  
  const getTotalPages = () => {
    return Math.ceil(filteredDoctors.length / itemsPerPage);
  };
  
  // Delete doctor
  const handleDelete = async (doctorId, doctorName) => {
    if (window.confirm(`Delete ${doctorName}? This action cannot be undone.`)) {
      const result = await deleteDoctor(doctorId);
      if (result.success) {
        alert('Doctor deleted successfully');
        loadDoctors();
      } else {
        alert('Failed to delete doctor: ' + result.message);
      }
    }
  };
  
  // Delete multiple doctors
  const handleBulkDelete = async () => {
    if (selectedDoctors.length === 0) {
      alert('Please select doctors to delete');
      return;
    }
    
    if (!window.confirm(`Delete ${selectedDoctors.length} doctor(s)? This action cannot be undone.`)) {
      return;
    }
    
    setLoading(true);
    for (const doctorId of selectedDoctors) {
      await deleteDoctor(doctorId);
    }
    setSelectedDoctors([]);
    loadDoctors();
  };
  
  // Send message to multiple doctors
  const handleBulkMessage = async () => {
    if (selectedDoctors.length === 0) {
      alert('Please select doctors to message');
      return;
    }
    
    const subject = prompt('Enter message subject:');
    if (!subject) return;
    
    const message = prompt('Enter message:');
    if (!message) return;
    
    setLoading(true);
    for (const doctorId of selectedDoctors) {
      await sendMessageToDoctor(doctorId, subject, message);
    }
    setSelectedDoctors([]);
    alert(`Message sent to ${selectedDoctors.length} doctor(s)`);
    loadDoctors();
  };
  
  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Specialization', 'Phone', 'License', 'Hospital', 'Status'];
    const data = filteredDoctors.map(d => [
      d.id,
      d.full_name,
      d.email,
      d.specialization || 'N/A',
      d.phone || 'N/A',
      d.license_number || 'N/A',
      d.hospital || 'N/A',
      d.is_active ? 'Active' : 'Inactive',
    ]);
    
    const csv = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctors-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };
  
  // Toggle doctor selection
  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctors(prev =>
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
  };
  
  // Select all doctors on current page
  const handleSelectAll = () => {
    const pageDoctorid = getPaginatedData().map(d => d.id);
    if (selectedDoctors.length === pageDoctorid.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(pageDoctorid);
    }
  };

  // Create credentials for doctor
  const handleCreateCredentials = async () => {
    if (!tempPassword) {
      alert('Please enter a temporary password');
      return;
    }
    const result = await createDoctorCredentials(selectedDoctor.id, tempPassword);
    if (result.success) {
      alert(`Credentials created! Username: ${selectedDoctor.email}\nPassword: ${tempPassword}`);
      setShowCredentialsModal(false);
      setTempPassword('');
    } else {
      alert('Failed to create credentials: ' + result.message);
    }
  };

  // Send message to doctor
  const handleSendMessage = async () => {
    if (!messageSubject || !messageText) {
      alert('Please fill in subject and message');
      return;
    }
    const result = await sendMessageToDoctor(
      selectedDoctor.id,
      messageSubject,
      messageText
    );
    if (result.success) {
      alert('Message sent successfully');
      setShowMessageModal(false);
      setMessageSubject('');
      setMessageText('');
    } else {
      alert('Failed to send message: ' + result.message);
    }
  };
  
  // Open edit modal
  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setShowAddModal(true);
  };
  
  // Close add modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingDoctor(null);
  };

  return (
    <div className="doctors-list-container">
      <div className="doctors-header">
        <h2>Doctors Management</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={20} /> Add New Doctor
          </button>
          <button className="btn-secondary" onClick={handleExportCSV}>
            <Download size={20} /> Export CSV
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} /> Filters
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by ID, name, or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="filters-container">
          <div className="filter-group">
            <label>Specialization</label>
            <select
              value={filters.specialization}
              onChange={(e) => setFilters({...filters, specialization: e.target.value})}
            >
              <option value="">All</option>
              {getUniqueSpecializations().map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Hospital</label>
            <select
              value={filters.hospital}
              onChange={(e) => setFilters({...filters, hospital: e.target.value})}
            >
              <option value="">All</option>
              {getUniqueHospitals().map(hospital => (
                <option key={hospital} value={hospital}>{hospital}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button 
            className="btn-secondary"
            onClick={() => setFilters({specialization: '', hospital: '', status: ''})}
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* Sorting */}
      <div className="sorting-container">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="date">Date Created</option>
        </select>
        
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          style={{marginLeft: '10px'}}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      
      {/* Bulk Actions */}
      {selectedDoctors.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedDoctors.length} doctor(s) selected</span>
          <button className="btn-info" onClick={handleBulkMessage}>
            <Send size={16} /> Message Selected
          </button>
          <button className="btn-danger" onClick={handleBulkDelete}>
            <Trash2 size={16} /> Delete Selected
          </button>
        </div>
      )}

      {/* Doctors Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="no-data">No doctors found</div>
        ) : (
          <>
            <table className="doctors-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedDoctors.length === getPaginatedData().length && getPaginatedData().length > 0}
                    />
                  </th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Phone</th>
                  <th>License #</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map((doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedDoctors.includes(doctor.id)}
                        onChange={() => handleSelectDoctor(doctor.id)}
                      />
                    </td>
                    <td className="doctor-id">{doctor.id}</td>
                    <td className="doctor-name">{doctor.full_name}</td>
                    <td className="doctor-email">{doctor.email}</td>
                    <td>{doctor.specialization || 'N/A'}</td>
                    <td>{doctor.phone || 'N/A'}</td>
                    <td>{doctor.license_number || 'N/A'}</td>
                    <td>
                      <span className={`status ${doctor.is_active ? 'active' : 'inactive'}`}>
                        {doctor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        title="Edit Doctor"
                        onClick={() => handleEditClick(doctor)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-credentials"
                        title="Create/Reset Credentials"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowCredentialsModal(true);
                        }}
                      >
                        🔐
                      </button>
                      <button
                        className="btn-message"
                        title="Send Message"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowMessageModal(true);
                        }}
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button
                        className="btn-delete"
                        title="Delete Doctor"
                        onClick={() => handleDelete(doctor.id, doctor.full_name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({length: getTotalPages()}, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'active' : ''}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                  disabled={currentPage === getTotalPages()}
                >
                  Next
                </button>
                
                <span className="page-info">
                  Page {currentPage} of {getTotalPages()} | Total: {filteredDoctors.length} doctors
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showAddModal && (
        <AddDoctorModal 
          onClose={handleCloseAddModal} 
          onSuccess={loadDoctors}
          editingDoctor={editingDoctor}
        />
      )}

      {/* Create Credentials Modal */}
      {showCredentialsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Login Credentials</h3>
            <p>Doctor: {selectedDoctor?.full_name}</p>
            <div className="form-group">
              <label>Temporary Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Enter temporary password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small>Username: {selectedDoctor?.email}</small>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCredentialsModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreateCredentials}>
                Create Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Send Message to Doctor</h3>
            <p>Doctor: {selectedDoctor?.full_name}</p>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Message subject"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter your message"
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowMessageModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



// Add/Edit Doctor Modal Component
const AddDoctorModal = ({ onClose, onSuccess, editingDoctor }) => {
  const [formData, setFormData] = useState(
    editingDoctor ? {
      username: editingDoctor.username || '',
      email: editingDoctor.email || '',
      full_name: editingDoctor.full_name || '',
      specialization: editingDoctor.specialization || '',
      license_number: editingDoctor.license_number || '',
      phone: editingDoctor.phone || '',
      hospital: editingDoctor.hospital || '',
    } : {
      username: '',
      email: '',
      full_name: '',
      specialization: '',
      license_number: '',
      phone: '',
      hospital: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    
    if (!editingDoctor && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      let result;
      
      if (editingDoctor) {
        // Update existing doctor
        result = await updateDoctor(editingDoctor.id, formData);
        if (result.success) {
          alert('Doctor updated successfully');
          onSuccess();
          onClose();
        } else {
          alert('Failed to update doctor: ' + result.message);
        }
      } else {
        // Create new doctor
        result = await createDoctor(formData);
        if (result.success) {
          alert('Doctor added successfully');
          onSuccess();
          onClose();
        } else {
          alert('Failed to add doctor: ' + result.message);
          if (result.errors) {
            setErrors(result.errors);
          }
        }
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal wide">
        <h3>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className={errors.full_name ? 'error' : ''}
              />
              {errors.full_name && <small className="error-text">{errors.full_name}</small>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={editingDoctor ? true : false}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username {!editingDoctor && '*'}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required={!editingDoctor}
                disabled={editingDoctor ? true : false}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <small className="error-text">{errors.username}</small>}
              {editingDoctor && <small>Cannot change username for existing doctor</small>}
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <small className="error-text">{errors.phone}</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className={errors.specialization ? 'error' : ''}
              />
              {errors.specialization && <small className="error-text">{errors.specialization}</small>}
            </div>
            <div className="form-group">
              <label>License Number</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hospital</label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleInputChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (editingDoctor ? 'Updating...' : 'Saving...') : (editingDoctor ? 'Update Doctor' : 'Add Doctor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorsList;


