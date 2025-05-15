import  jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "./catchAsyncError.js";
import { config } from "dotenv";
import { redis } from "../utils/redis.js";
config()

export const isAuthenticated = CatchAsyncError(async(req,resizeBy,next)=>{
    const access_token = req.cookies.access_token;
    if(!access_token)
        return next(new ErrorHandler("Please login to access this resource",400));

    const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN);

    if(!decoded){
        return next(new ErrorHandler("Access token is not valid",400));
    }

    const user = await redis.get(decoded.id);

    if(!user){
        return next(new ErrorHandler("User not found",400));
    }

    req.user = JSON.parse(user);
    next();
})


// validate user role
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user?.role || "")) {
        return next(
          new ErrorHandler(
            `Role: ${req.user?.role} is not authorized to access this route`,
            400
          )
        );
      }
      next();
    };
  };
