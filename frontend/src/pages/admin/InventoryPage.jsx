import React from 'react';
import {useApi} from "../../hooks/userApi.js";


const InventoryPage = () => {
  const { data: inventory, loading, error } = useApi('/inventory/');

  if (loading) return <div>Loading inventory...</div>;
  if (error) return <div>Error loading inventory</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Live Blood Stock</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
          + Add Stock
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
            <th className="px-6 py-4 font-medium">Blood Group</th>
            <th className="px-6 py-4 font-medium">Total Units</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Last Updated</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {inventory?.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold text-gray-800">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">{item.blood_group}</span>
              </td>
              <td className="px-6 py-4 text-gray-600">{item.units} ml</td>
              <td className="px-6 py-4">
                {/* Status Badges */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.units > 50 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.units > 50 ? 'Adequate' : 'Low Stock'}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500 text-sm">{item.last_updated}</td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;