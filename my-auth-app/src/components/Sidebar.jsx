import React from 'react';

const menuItems = [
    { label: 'Add Assignments', value: 'assignments' },
    { label: 'Notifications', value: 'notifications' },
    { label: 'Requests', value: 'requests' },
    { label: 'Update Student', value: 'updateStudent' },
    { label: 'Approved Requests', value: 'ApprovedRequests' },
  ];
  
const Sidebar = ({ onSelect, hasNewRequest }) => {
  return (
    <div className="sidebar w-64 bg-gray-800 text-white p-4 shadow-lg rounded-lg transition-all ease-in-out duration-300 pt-16">
      <ul>
        {menuItems.map((item) => (
          <li key={item.value} className="mb-2">
            <button
              onClick={() => onSelect(item.value)}
              className="w-full text-left py-3 px-5 rounded-lg hover:bg-gray-700 hover:scale-105 transition transform duration-200 ease-in-out flex items-center gap-2"
            >
              <span>{item.label}</span>
              {item.value === 'requests' && hasNewRequest && (
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};



  

export default Sidebar;
