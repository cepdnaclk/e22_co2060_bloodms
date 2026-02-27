import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import DonorDashboard from './pages/donor/Dashboard';
import StaffDashboard from './pages/staff/StaffDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          
          {/* Placeholder Routes - You will build these out! */}
          <Route path='donor/dashboard' element={<DonorDashboard />} />
          <Route path='staff/dashboard' element={<StaffDashboard />} />
          
          {/* Add Camp and Admin routes here... */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
