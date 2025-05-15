import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/courseCard';

const Catalog = () => {
  const BACKEND_URI=import.meta.env.VITE_BACKEND_URL
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchCourses = async () =>{
        try{
            const response = await axios.get(`${BACKEND_URI}/get-catalog-courses`)
            setAllCourses(response.data.modifiedCourses);
        }catch(error){
            console.log("Error Fetching Courses", error);
        } finally{
            setLoading(false);
        }
    }
    fetchCourses();
  }, [])
  
  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-700">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-19 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        Course Catalog
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {allCourses.map((course) =>(
            <CourseCard key={course._id} course={course}></CourseCard>
        ))
        }
      </div>
    </div>
  );
};

export default Catalog;