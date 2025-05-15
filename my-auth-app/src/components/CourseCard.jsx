import React, {useState, useEffect} from "react";
import useUserStore from "../store/useUserStore";
import axios from "axios";

const CourseCard = ({ course }) => {
  const user = useUserStore((state) => state.user);
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
  const [enrolled, setEnrolled] = useState(false);

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="fas fa-star text-yellow-500"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-yellow-500"></i>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-yellow-500"></i>
      );
    }

    return stars;
  };
  // console.log(course._id)
  // console.log(user._id)
  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URI}/courses/${course._id}/enrollRequest`,
        {userId:user._id},
        {
            withCredentials: true,
            
        }
      );
    } catch (error) {
      console.error("Error enrolling in course", error);
    }
  };

  useEffect(()=>{
    const checkEnrollmentStatus = async()=>{
      try{
        const response = await axios.get(`${BACKEND_URI}/courses/enrollment-status`, {
          params: {
            userId: user._id,
            courseId: course._id,
          },
          withCredentials: true,
        });
        console.log(response);
        if(response.data){
          setEnrolled(response.data.status);
        }
      }catch(error){
        console.error("Fialed to fetch enrollment status",error);
      }
    }
    if(user?._id) checkEnrollmentStatus();
  },[user._id,course._id])

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <img
        src={course.thumbnail?.url || "https://via.placeholder.com/300x200"}
        alt={course.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          {course.name}
        </h3>
        <p className="text-gray-600 mb-4">{course.description}</p>

        {/* Rating Section */}
        <div className="flex items-center mb-4 space-x-2">
          <div className="flex">{renderStars(course.ratings || 0)}</div>
          <span className="text-sm text-gray-600">
            {course.ratings ? course.ratings.toFixed(1) : "No rating"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">
            ₹{course.price}
          </span>
          <button
            onClick={handleEnroll}
            className={`${
              enrolled ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white px-4 py-2 rounded-lg transition-colors`}
            disabled={enrolled} // Disable the button once enrolled
          >
            {enrolled ? "Requested" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
