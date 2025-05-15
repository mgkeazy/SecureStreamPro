import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import enrollmentModel from "../models/enrollment.model.js";


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
