import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import '../components/admin/AdminSidebar.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

