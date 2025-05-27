import React, { useState, useEffect } from "react";
import axios from "axios";
import RequestItem from "./RequestItem";

const Requests = () => {
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

  const handleAccept = async (id) => {
    try {
      await axios.post(
        `${BACKEND_URI}/enrollments/${id}/approve`,
        {},
        { withCredentials: true }
      );
      alert(`Request ${id} accepted`);
      setEnrollmentRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      alert(`Failed to accept request: ${error.message}`);
    }
  };

  const handleReject = (id) => alert(`Request ${id} rejected`);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/enrollments/pending`, {
          withCredentials: true,
        });

        const formatted = response.data.enrollments.map((req) => ({
          ...req,
          course: {
            ...req.course,
            title: req.course.name,
            description: req.course.description,
            level: req.course.level || "N/A",
          },
          user: {
            ...req.user,
            profilePicture:
              req.user.profilePicture ||
              "https://i.pinimg.com/474x/d8/a5/0d/d8a50d8daa0b2b81dfd7ed31efa0784c.jpg?nii=t",
            phone: req.user.phone || "N/A",
            address: req.user.address || "N/A",
            dateOfBirth: req.user.dateOfBirth || "N/A",
          },
        }));

        setEnrollmentRequests(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingRequests();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 max-w-4xl mx-auto">
      <h1 className="text-center sm:text-left text-3xl font-bold mb-12 text-gray-900">
        Enrollment Requests
      </h1>

      {enrollmentRequests.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No pending enrollment requests.
        </p>
      ) : (
        <section className="space-y-10">
          {enrollmentRequests.map((req) => (
            <RequestItem
              key={req._id}
              req={req}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default Requests;
