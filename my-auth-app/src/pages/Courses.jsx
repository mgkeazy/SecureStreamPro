import React, { useEffect, useState } from 'react';
import useUserStore from '../store/useUserStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useVideoStore from '../store/useVideoStore';


const Courses = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [showContent, setShowContent] = useState({});
  const setVideoId = useVideoStore((state) => state.setVideoId);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/get-user-courses', {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);
  console.log(courses)
  const toggleCourseExpand = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const toggleCourseContent = (courseId) => {
    setShowContent((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pt-24 pb-20 sm:p-8 md:p-10 lg:p-12 xl:p-16">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 pt-5">
        My Courses
      </h1>
      <div className="space-y-8">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="p-6">
              <h2
                className="text-2xl font-semibold text-indigo-700 cursor-pointer hover:text-indigo-900"
                onClick={() => toggleCourseExpand(course._id)}
              >
                {course.name}
              </h2>
              {expandedCourses[course._id] && (
                <div className="mt-4 space-y-4">
                  <p className="text-gray-700 leading-relaxed">{course.description}</p>
                  <div className="flex flex-wrap text-sm text-gray-600 gap-4">
                    <span><strong>Category:</strong> {course.categories}</span>
                    <span><strong>Level:</strong> {course.level}</span>
                    <span><strong>Tags:</strong> {Array.isArray(course.tags) ? course.tags.join(', ') : course.tags}</span>
                    <span><strong>Price:</strong> ₹{course.price}</span>
                  </div>
                  {course.prerequisites?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Prerequisites</h4>
                      <ul className="list-inside list-decimal text-gray-700 ml-4">
                        {course.prerequisites.map((item) => (
                          <li key={item._id}>{item.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {course.benefits?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">What You'll Learn</h4>
                      <ul className="list-inside list-disc text-gray-700 ml-4">
                        {course.benefits.map((item) => (
                          <li key={item._id}>{item.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {course.demoUrl && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Demo Video</h4>
                      <div className="aspect-w-16 aspect-h-9">
                        <video controls src={course.demoUrl} className="rounded-md shadow-md" />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => toggleCourseContent(course._id)}
                    className="mt-4 inline-block bg-indigo-200 hover:bg-indigo-300 text-indigo-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {showContent[course._id] ? 'Hide Content' : 'Show Content'}
                  </button>
                  {showContent[course._id] && (
                    <div className="mt-6 space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900">Course Videos</h3>
                      {course.courseData?.length === 0 ? (
                        <p className="text-gray-600">No videos available.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {course.courseData.map((video, idx) => (
                            <div key={idx} className="bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200">
                              <h4 className="text-indigo-700 font-semibold mb-1 px-2 pt-2">{video.title}</h4>
                              <div className="my-2 px-2">
                                <button
                                  onClick={() => {
                                    setVideoId(video.videoUrl);
                                    navigate(`/courses/${course._id}/watch/${video._id}`)
                                  }}
                                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                                >
                                  Watch Video
                                </button>
                              </div>
                              <p className="text-gray-700 text-sm mb-1 px-2"><strong>Description:</strong> {video.description}</p>
                              <p className="text-gray-700 text-sm px-2 pb-2"><strong>Section:</strong> {video.videoSection} &bull; <strong>Length:</strong> {video.videoLength} mins</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
