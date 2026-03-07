import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/layout/PrivateRoute';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorEligibility from './pages/donor/DonorEligibility';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import LabDashboard from './pages/staff/LabDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import ContactPage from './pages/public/ContactPage';
import Events from "./pages/events/Events";
import AboutUs from "./pages/public/AboutUs";
import Services from "./pages/public/Services"; 
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
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />

              {/* Protected Routes */}
              <Route path="/donor" element={<PrivateRoute><DonorDashboard /></PrivateRoute>} />
              <Route path="/donor/eligibility" element={<PrivateRoute><DonorEligibility /></PrivateRoute>} />
              <Route path="/doctor" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
              {/* Renamed lab to staff path logically */}
              <Route path="/staff" element={<PrivateRoute><LabDashboard /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/patient" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />

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
