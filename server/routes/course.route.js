import express from "express";
import { addAnswer, addQuestion, addReplyToReview, addReview, deleteCourse, editCourse, enrollmentRequest, enrollmentStatus, getAllCatalogCourses, getAllCourses, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/course.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
const courseRouter = express.Router();

courseRouter.post("/create-course", isAuthenticated, authorizeRoles("admin"), uploadCourse);

courseRouter.put("/edit-course/:id", isAuthenticated ,authorizeRoles("admin"),editCourse);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", isAuthenticated, addQuestion);

courseRouter.put("/add-answer", isAuthenticated, addAnswer);

courseRouter.post("/courses/:id/add-review", isAuthenticated, addReview);

courseRouter.put(
    "/add-reply",
    isAuthenticated,
    authorizeRoles("admin"),
    addReplyToReview
  );
  
  courseRouter.get(
    "/get-catalog-courses",
    // isAuthenticated,
    // authorizeRoles("admin"),
    getAllCatalogCourses
  );

  courseRouter.delete(
    "/delete-course/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCourse
  );
  
  courseRouter.post("/courses/:courseId/enrollRequest", isAuthenticated, enrollmentRequest);
  courseRouter.get("/courses/enrollment-status", isAuthenticated, enrollmentStatus);
  


export default courseRouter