import React from 'react';
import { Link } from 'react-router-dom';

interface RoleCardProps {
  title: string;
  description: string;
  linkTo: string;
  color: string; // 'red', 'blue', 'green', 'gray'
  icon?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, linkTo, color }) => {
  return (
    <Link 
      to={linkTo} 
      className={`block p-6 bg-white rounded-lg border-t-4 border-${color}-500 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}
    >
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className={`mt-4 text-${color}-600 font-semibold text-sm`}>
        Access Portal &rarr;
      </div>
    </Link>
  );
};

export default RoleCard;