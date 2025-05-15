import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import CourseModel from "../models/course.model.js";


// create Course
export const createCourse = CatchAsyncError(async (data,res) => {
  const course = await CourseModel.create(data);
  res.status(201).json({
    success: true,
    course,
  })
});


// get all courses
export const getAllCoursesService = async (res) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });

  const modifiedCourses = courses.map(course => ({
    _id: course._id,
    name: course.name,
    description: course.description,
    categories: course.categories,
    price: course.price,
    estimatedPrice: course.estimatedPrice,
    thumbnail: course.thumbnail,
    tags: course.tags,
    level: course.level,
    demoUrl: course.demoUrl,
    ratings : course.ratings,
    reviews: course.reviews.map(review => ({
      rating: review.rating,
      comment: review.comment,
      reviewerName: review.reviewerName || 'Anonymous'
    }))
  }));

  res.status(201).json({
    success: true,
    modifiedCourses,
  });
};