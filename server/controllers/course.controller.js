import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import { createCourse, getAllCoursesService } from "../services/course.service.js";
import { redis } from "../utils/redis.js";
import CourseModel from "../models/course.model.js";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import NotificationModel from "../models/notificationModel.js";
import userModel from "../models/user.model.js";
import enrollmentModel from "../models/enrollment.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// upload course
export const uploadCourse = CatchAsyncError(
  async (req, res, next) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// edit course

export const editCourse = CatchAsyncError(
  async (req, res, next) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      const courseId = req.params.id;

      const courseData = await CourseModel.findById(courseId);

      if (thumbnail && !thumbnail.startsWith("https")) {
        await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: courseData?.thumbnail.public_id,
          url: courseData?.thumbnail.url,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      await redis.set(courseId, JSON.stringify(course)); // update course in redis

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single course ----- without purchasing

export const getSingleCourse = CatchAsyncError(
  async (req, res, next) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses ----- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req, res, next) => {
    try {
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content ---- only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req, res, next) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      const courseExists = userCourseList?.find(
        (course) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course.", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course
export const addQuestion = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { question, courseId, contentId } = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const courseContent = course?.courseData?.find((item) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object

      const newQuestion = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      courseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: " New Question Received",
        message: `You have a new Question in ${courseContent.title}`,
      });

      // save the updated course
      await course?.save();

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//   add answer to course question

export const addAnswer = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { answer, courseId, contentId, questionId } =
        req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const courseContent = course?.courseData?.find((item) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = courseContent?.questions?.find((item) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // create a new answer object

      const newAnswer = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // add this answer to our course content
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        await NotificationModel.create({
          userId: req.user?._id,
          title: " New Answer Received",
          message: `You have a new Answer in ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.render(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add review in course
export const addReview = CatchAsyncError(
  async (req, res, next) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;
      console.log(userCourseList)
      // check if courseId is already exists in userCourseList based on _id
      const courseExists = userCourseList?.some(
        (course) => course.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course.", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body;

      const reviewData = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      if (course.ratings || course.ratings > 0) {
        // If ratings already exist (including 0), update it with the new rating
        course.ratings = (course.ratings + rating) / 2;
      } else {
        // If no ratings exist (first review), set it to the new rating
        course.ratings = rating;
      }
      

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      // create notification
      // await NotificationModel.create({
      //   user: req.user?._id,
      //   title: "New Review Received",
      //   message: `${req.user?.name} has given a review in ${course?.name}`,
      // });

      res.status(200).json({
        success: true,
        // course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// // add Reply in Review

export const addReplyToReview = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { comment, courseId, reviewId } = req.body;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Invalid course id", 400));
      }

      const review = course?.reviews?.find(
        (rev) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("Review Not Found", 400));
      }

      const replyData = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days


      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all Catalog Courses
export const getAllCatalogCourses = CatchAsyncError(
  async (req, res, next) => {
    try {
      getAllCoursesService(res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// // delete course --only for Admin
export const deleteCourse = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// enroll request for Course
export const enrollmentRequest = CatchAsyncError(
  async(req,res,next) => {
    try{
      const {courseId} = req.params;
      const {userId} = req.body;

      // console.log(courseId)

      const course = await CourseModel.findById(courseId);
      
      if(!course){
        return next(new ErrorHandler("Course not found", 404));
      }
  
      const user = await userModel.findById(userId);
      if(!user){
        return next(new ErrorHandler("User not found", 404));
      }

      const existingEnrollment = await enrollmentModel.findOne({
        user:userId,
        course:courseId,
      });

      if(existingEnrollment){
        return next(new ErrorHandler("User have already requested for enrollment in this course",400))
      }

      const enrollment = await enrollmentModel.create({
        user:userId,
        course:courseId,
        status:"pending"
      });

      res.status(201).json({
        success:true,
        message:"Enrollment request submittted successfully",
        enrollment,
      })
    }catch(error){
      return next(new ErrorHandler(error.message, 400));
    }
  }
)
// enroll request for Course
export const enrollmentStatus = CatchAsyncError(
  async(req,res,next) => {
    try{
      const {courseId, userId} = req.query;

      const course = await CourseModel.findById(courseId);
      
      if(!course){
        return next(new ErrorHandler("Course not found", 404));
      }
  
      const user = await userModel.findById(userId);
      if(!user){
        return next(new ErrorHandler("User not found", 404));
      }

      const existingEnrollment = await enrollmentModel.findOne({
        user:userId,
        course:courseId,
      });
      
      if(!existingEnrollment){
        return next(new ErrorHandler("You have not performed any operation for this course yet",404))
      }
      
      const status= existingEnrollment.status;
      res.status(201).json({
        success:true,
        status
      })
    }catch(error){
      return next(new ErrorHandler(error.message, 400));
    }
  }
)

// // generate video url
// export const generateVideoUrl = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { videoId } = req.body;
//       const response = await axios.post(
//         `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
//         { ttl: 300 },
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
//           },
//         }
//       );
//       res.json(response.data);
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

