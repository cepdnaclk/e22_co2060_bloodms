import React from 'react';
import RoleCard from '../../components/common/RoleCard';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Save a Life Today</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Welcome to the centralized Blood Bank Management System. Please select your role to proceed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl px-4">
        <RoleCard 
          title="Donor" 
          description="Register to donate, view history, and find camps." 
          linkTo="/donor/dashboard" 
          color="red" 
        />
        <RoleCard 
          title="Medical Staff" 
          description="Manage blood stock, verify donors, and update records." 
          linkTo="/staff/dashboard" 
          color="blue" 
        />
        <RoleCard 
          title="Camp Organizer" 
          description="Host a blood drive and manage volunteers." 
          linkTo="/camp/dashboard" 
          color="green" 
        />
        <RoleCard 
          title="Admin" 
          description="System overview and user management." 
          linkTo="/admin/dashboard" 
          color="gray" 
        />
      </div>
    </div>
  );
};

export default Home;
