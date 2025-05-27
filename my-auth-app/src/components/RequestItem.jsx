import React from "react";
import UserInfo from "./UserInfo";
import CourseInfo from "./CourseInfo";

const RequestItem = ({ req, onAccept, onReject }) => (
  <article className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-start gap-6">
    <img
      src={req.user.profilePicture}
      alt={`${req.user.name} profile`}
      className="w-24 h-24 rounded-full object-cover flex-shrink-0 mx-auto sm:mx-0"
    />
    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-6">
      <UserInfo user={req.user} />
      <CourseInfo course={req.course} />
    </div>

    {/* Buttons stay here in RequestItem, using the onAccept and onReject callbacks */}
    <div className="flex sm:flex-col gap-4 justify-center sm:justify-start mt-6 sm:mt-0">
      <button
        onClick={() => onAccept(req._id)}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow transition duration-200 w-full sm:w-auto"
        type="button"
      >
        Accept
      </button>
      <button
        onClick={() => onReject(req._id)}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md shadow transition duration-200 w-full sm:w-auto"
        type="button"
      >
        Reject
      </button>
    </div>
  </article>
);

export default RequestItem;
