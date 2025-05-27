import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import CourseModel from "../models/course.model.js";
import enrollmentModel from "../models/enrollment.model.js";
import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import ejs from "ejs"
import sendMail from "../utils/sendMail.js";
import { redis } from "../utils/redis.js";
import NotificationModel from "../models/notificationModel.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getPendingEnrollments = CatchAsyncError(
    async(req,res,next)=>{
        try{
            const enrollments = await enrollmentModel.find({status:'pending'})
            .populate('user')
            .populate('course')
            .exec()

            res.status(200).json({
                message: 'Enrollments fetched successfully',
                enrollments: enrollments,
              });
        }
        catch(error){
            return next(new ErrorHandler(error.message, 400));
        }
    }
)

export const approveEnrollRequest = CatchAsyncError(
    async(req,res,next)=>{
        try{
            const {enrollmentId} = req.params;

            const enrollmentRequest = await enrollmentModel.findById(enrollmentId);

            if(!enrollmentRequest){
                return next(new ErrorHandler("EnrollMent Request does not exists",400));
            }
            

            const userId =enrollmentRequest.user.toString();
            const courseId = enrollmentRequest.course.toString();
            
            const user = await userModel.findById(userId);
  
            const courseExistInUser = user?.courses.some(
                (course) => course._id.toString() === courseId
            );
            
            
            if (courseExistInUser) {
                return next(
                    new ErrorHandler("You have already purchased this course", 409)
                );
            }

            const course = await CourseModel.findById(courseId);
    
            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            const data = {
                courseId: course._id,
                userId: user?._id,
                // payment_info,
            };
            
            const mailData = {
                order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                },
            };

            try {
                if (user) {
                    await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                    });
                }
            } catch (error) {
                return next(new ErrorHandler(error.message, 400));
            }
            
            user.courses.push(courseId);
        
            await user.save();

            await NotificationModel.create({
                userId: user?._id,
                title: " New Order",
                message: `You have a new order from ${course?.name}`,
            });


            course.purchased = course.purchased + 1;

            await course.save();

            enrollmentRequest.status = "approved"
            
            enrollmentRequest.save();

            res.status(201).json({
                message:"Enrollment Request approved",
            })
        }catch(error){
            return next(new ErrorHandler(error.message,400));
        }
    }
)