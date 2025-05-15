import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Requests from '../components/EnrollRequests';
// import AddAssignments from '../components/AddAssignments';
// import Notifications from '../components/Notifications';
// import Requests from '../components/Requests';
// import UpdateStudent from '../components/UpdateStudent';

const AdminHomePage = () => {
  const [selectedOption, setSelectedOption] = useState('assignments');

  const renderContent = () => {
    switch (selectedOption) {
      // case 'assignments':
      //   return <AddAssignments />;
      // case 'notifications':
      //   return <Notifications />;
      case 'requests':
        return <Requests/>;
      // case 'updateStudent':
      //   return <UpdateStudent />;
      default:
        return <div>Select an option to view content</div>;
    }
  };

  return (
    <div className="admin-dashboard flex h-screen flex-col">
      {/* Header */}
      {/* <header className="bg-gray-800 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </header> */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="sidebar-container w-64 bg-gray-800 text-white p-6 transition-all ease-in-out duration-300">
          <Sidebar onSelect={setSelectedOption} />
        </div>

        {/* Right Content Area */}
        <div className="right-content flex-1 p-6 bg-gray-100 overflow-auto">
          <div className="content-header mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
            </h2>
          </div>
          <div className="content-body">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
