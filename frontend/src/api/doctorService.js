import axios from 'axios';

// Get token from localStorage
const getAuthToken = () => {
  const stored = localStorage.getItem('authTokens');
  return stored ? JSON.parse(stored)?.access : null;
};

// Create axios instance for doctor operations
const doctorAPI = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
doctorAPI.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * FETCH ALL DOCTORS
 * GET /doctors/
 * Returns: List of all doctors
 */
export const fetchAllDoctors = async () => {
  try {
    const response = await doctorAPI.get('/doctors/');
    return {
      success: true,
      data: response.data,
      message: 'Doctors fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to fetch doctors',
    };
  }
};

/**
 * GET SINGLE DOCTOR BY ID
 * GET /doctors/:id/
 * Returns: Doctor details
 */
export const fetchDoctorById = async (doctorId) => {
  try {
    const response = await doctorAPI.get(`/doctors/${doctorId}/`);
    return {
      success: true,
      data: response.data,
      message: 'Doctor fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to fetch doctor',
    };
  }
};

/**
 * SEARCH DOCTORS BY ID
 * GET /doctors/?search=:searchTerm
 * Returns: Filtered doctors list
 */
export const searchDoctors = async (searchTerm) => {
  try {
    const response = await doctorAPI.get('/doctors/', {
      params: { search: searchTerm },
    });
    return {
      success: true,
      data: response.data,
      message: 'Search completed',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Search failed',
    };
  }
};

/**
 * CREATE NEW DOCTOR
 * POST /doctors/
 * Payload:
 * {
 *   username: string,
 *   email: string,
 *   full_name: string,
 *   specialization: string,
 *   license_number: string,
 *   phone: string,
 *   hospital: string (optional)
 * }
 * Returns: Created doctor object with ID
 */
export const createDoctor = async (doctorData) => {
  try {
    const response = await doctorAPI.post('/doctors/', doctorData);
    return {
      success: true,
      data: response.data,
      message: 'Doctor created successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to create doctor',
      errors: error.response?.data, // Validation errors
    };
  }
};

/**
 * UPDATE DOCTOR DETAILS
 * PUT /doctors/:id/
 * Payload: Any fields to update
 * Returns: Updated doctor object
 */
export const updateDoctor = async (doctorId, updateData) => {
  try {
    const response = await doctorAPI.put(`/doctors/${doctorId}/`, updateData);
    return {
      success: true,
      data: response.data,
      message: 'Doctor updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to update doctor',
      errors: error.response?.data,
    };
  }
};

/**
 * CREATE LOGIN CREDENTIALS FOR DOCTOR
 * POST /doctors/:id/create-credentials/
 * Payload:
 * {
 *   password: string (temporary password)
 * }
 * Returns: Credentials info
 */
export const createDoctorCredentials = async (doctorId, password) => {
  try {
    const response = await doctorAPI.post(`/doctors/${doctorId}/create-credentials/`, {
      password,
    });
    return {
      success: true,
      data: response.data,
      message: 'Credentials created successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to create credentials',
    };
  }
};

/**
 * RESET DOCTOR PASSWORD
 * POST /doctors/:id/reset-password/
 * Payload:
 * {
 *   new_password: string
 * }
 * Returns: Success message
 */
export const resetDoctorPassword = async (doctorId, newPassword) => {
  try {
    const response = await doctorAPI.post(`/doctors/${doctorId}/reset-password/`, {
      new_password: newPassword,
    });
    return {
      success: true,
      data: response.data,
      message: 'Password reset successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to reset password',
    };
  }
};

/**
 * DELETE DOCTOR
 * DELETE /doctors/:id/
 * Returns: Success message
 */
export const deleteDoctor = async (doctorId) => {
  try {
    const response = await doctorAPI.delete(`/doctors/${doctorId}/`);
    return {
      success: true,
      data: response.data,
      message: 'Doctor deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to delete doctor',
    };
  }
};

/**
 * SEND MESSAGE TO DOCTOR
 * POST /doctors/:id/send-message/
 * Payload:
 * {
 *   subject: string,
 *   message: string
 * }
 * Returns: Message sent confirmation
 */
export const sendMessageToDoctor = async (doctorId, subject, message) => {
  try {
    const response = await doctorAPI.post(`/doctors/${doctorId}/send-message/`, {
      subject,
      message,
    });
    return {
      success: true,
      data: response.data,
      message: 'Message sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to send message',
    };
  }
};

/**
 * GET DOCTOR STATISTICS (Optional - for dashboard)
 * GET /doctors/stats/
 * Returns: Doctor count, active doctors, etc.
 */
export const getDoctorStats = async () => {
  try {
    const response = await doctorAPI.get('/doctors/stats/');
    return {
      success: true,
      data: response.data,
      message: 'Stats fetched successfully',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.detail || 'Failed to fetch stats',
    };
  }
};

export default doctorAPI;
