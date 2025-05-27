import React from "react";

const UserInfo = ({ user }) => (
  <div className="sm:w-1/2 space-y-1 text-center sm:text-left">
    <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
    <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
    <p className="text-gray-700"><strong>Phone:</strong> {user.phone}</p>
    <p className="text-gray-700"><strong>Address:</strong> {user.address}</p>
    <p className="text-gray-700"><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
  </div>
);

export default UserInfo;
