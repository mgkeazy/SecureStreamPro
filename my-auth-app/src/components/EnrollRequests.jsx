import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Requests = () => {
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

  const handleAccept = (id) => {
    // Logic for accepting the request goes here
    alert(`Request ${id} accepted`);
  };

  const handleReject = (id) => {
    // Logic for rejecting the request goes here
    alert(`Request ${id} rejected`);
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/enrollments/pending`, {
          withCredentials: true,
        });

        // Optional: normalize data if needed
        const formatted = response.data.enrollments.map((req) => ({
          ...req,
          course: {
            ...req.course,
            title: req.course.name,
            description: req.course.description,
            level: req.course.level || 'N/A',
          },
          user: {
            ...req.user,
            profilePicture: req.user.profilePicture || 'https://via.placeholder.com/150',
            phone: req.user.phone || 'N/A',
            address: req.user.address || 'N/A',
            dateOfBirth: req.user.dateOfBirth || 'N/A',
          },
        }));

        setEnrollmentRequests(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingRequests();
  }, []);
  console.log(enrollmentRequests)
  return (
    <div className="requests-container p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Enrollment Requests</h2>

      {enrollmentRequests.length === 0 ? (
        <p className="text-gray-600 text-lg">No pending enrollment requests.</p>
      ) : (
        <div className="requests-list space-y-8">
          {enrollmentRequests.map((request) => (
            <div
              key={request._id}
              className="request-card bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200 ease-in-out"
            >
              {/* User Info */}
              <div className="user-info flex gap-6 mb-8">
                <img
                  src={request.user.profilePicture}
                  alt="User Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{request.user.name}</h3>
                  <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {request.user.email}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {request.user.phone}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Address:</strong> {request.user.address}</p>
                  <p className="text-sm text-gray-600"><strong>Date of Birth:</strong> {request.user.dateOfBirth}</p>
                </div>
              </div>

              {/* Course Info */}
              <div className="course-info mb-8">
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Course: {request.course.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{request.course.description}</p>
                <p className="text-sm text-gray-600"><strong>Level:</strong> {request.course.level}</p>
              </div>

              {/* Action Buttons */}
              <div className="actions mt-6 flex justify-end gap-6">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="accept-btn bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  className="reject-btn bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
