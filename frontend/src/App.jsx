import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RoleRoute from './api/RoleRoute';

import Navbar from './components/layout/Navbar';
import LandingPage from './pages/public/LandingPage';

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

import DonorDashboard from './pages/donor/DonorDashboard';
import DonorEligibility from './pages/donor/DonorEligibility';
import DonorRegistration from './pages/donor/DonorRegistration';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import LabDashboard from './pages/staff/LabDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import ContactPage from './pages/public/ContactPage';
import Events from "./pages/events/Events";
import AboutUs from "./pages/public/AboutUs";
import Services from "./pages/public/Services";
import Unauthorized from "./pages/public/Unauthorized";
import './App.css';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* ─── Public Routes ─── */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/events" element={<Events />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/services" element={<Services />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* ─── Donor Routes (donor + admin) ─── */}
                <Route path="/donor" element={
                  <RoleRoute allowedRoles={['donor', 'admin']}>
                    <DonorDashboard />
                  </RoleRoute>
                } />
                <Route path="/donor/eligibility" element={
                  <RoleRoute allowedRoles={['donor', 'admin']}>
                    <DonorEligibility />
                  </RoleRoute>
                } />
                <Route path="/donor/register" element={
                  <RoleRoute allowedRoles={['donor', 'admin']}>
                    <DonorRegistration />
                  </RoleRoute>
                } />

                {/* ─── Doctor / Medical Routes (doctor + medical_officer + admin) ─── */}
                <Route path="/doctor" element={
                  <RoleRoute allowedRoles={['doctor', 'medical_officer', 'admin']}>
                    <DoctorDashboard />
                  </RoleRoute>
                } />

                {/* ─── Lab / Staff Routes (medical_officer + admin) ─── */}
                <Route path="/staff" element={
                  <RoleRoute allowedRoles={['medical_officer', 'admin']}>
                    <LabDashboard />
                  </RoleRoute>
                } />

                {/* ─── Admin Routes (admin only) ─── */}
                <Route path="/admin" element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                } />

                {/* ─── Patient Routes (doctor + medical_officer + admin) ─── */}
                <Route path="/patient" element={
                  <RoleRoute allowedRoles={['doctor', 'medical_officer', 'admin']}>
                    <PatientDashboard />
                  </RoleRoute>
                } />

                {/* Catch all redirect to landing page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
