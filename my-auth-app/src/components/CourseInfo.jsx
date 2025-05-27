import React from "react";

const CourseInfo = ({ course }) => (
  <div className="sm:w-1/2 space-y-1 text-center sm:text-left border-t sm:border-t-0 sm:border-l sm:pl-6 border-gray-200 pt-4 sm:pt-0">
    <h3 className="text-lg font-semibold text-gray-800 mb-1">Course: {course.title}</h3>
    <p className="text-gray-600">{course.description}</p>
    <p className="text-gray-700 font-medium">
      Level: <span className="text-gray-900">{course.level}</span>
    </p>
  </div>
);

export default CourseInfo;
