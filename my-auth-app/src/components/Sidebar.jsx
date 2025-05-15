import React from 'react';

const menuItems = [
    { label: 'Add Assignments', value: 'assignments' },
    { label: 'Notifications', value: 'notifications' },
    { label: 'Requests', value: 'requests' },
    { label: 'Update Student', value: 'updateStudent' },
  ];
  
  const Sidebar = ({ onSelect }) => {
    return (
      <div className="sidebar w-64 bg-gray-800 text-white p-4 shadow-lg rounded-lg transition-all ease-in-out duration-300 pt-16">
        <ul>
          {menuItems.map((item) => (
            <li key={item.value}>
              <button
                onClick={() => onSelect(item.value)}
                className="w-full text-left py-3 px-5 rounded-lg hover:bg-gray-700 hover:scale-105 transition transform duration-200 ease-in-out"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  

export default Sidebar;
