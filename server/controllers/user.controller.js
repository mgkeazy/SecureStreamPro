import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail.js";
config();

import { fileURLToPath } from "url";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service.js";
import cloudinary from "cloudinary"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registrationUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    const isEmailExist = await userModel.findOne({ email });

    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }
    const user = {
      name,
      email,
      password,
    };
    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

export const activateUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { activation_token, activation_code } = req.body;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//Login User
export const loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter email and password", 400));

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Credentials", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid Credentials", 400));

    sendToken(user, 200, res);
  } catch (error) {
    return next(ErrorHandler(error.message, 400));
  }
});

//Logout user
export const logoutUser = CatchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    const userId = req.user?._id || "";
    redis.del(userId);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// update access token
export const updateAccessToken = CatchAsyncError(async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    const message = "Could not refresh token";
    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }
    const session = await redis.get(decoded.id);

    if (!session) {
      return next(
        new ErrorHandler("Please login to access this resource!", 400)
      );
    }
    const user = JSON.parse(session);

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "3d",
    });

    req.user = user;

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(200).json({
      status: "success",
      accessToken,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get user info

export const getUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    getUserById(userId, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


//social auth
export const socialAuth =CatchAsyncError(async(req,res,next)=>{
    try{
        const {email,name,avatar} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            const newUser = await userModel.create({email,name,avatar});
            sendToken(newUser,200,res);
        }else{
            sendToken(user,200,res);
        }
    }catch(error){
        return next(new ErrorHandler(error.message,400))
    }
})


//update user info
export const updateUserInfo = CatchAsyncError(async(req,res,next)=>{
    try{
        const { name, email } = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);

        if(email && user){
            const isEmailExists = await userModel.findOne({email});

            if(isEmailExists && isEmailExists._id.toString() !== user._id.toString()){
                return next(new ErrorHandler("Email Already exists",400));
            }
            user.email=email;
        }

        if(name && user){
            user.name=name;
        }

        await user?.save();

        await redis.set(userId,JSON.stringify(user));

        res.status(200).json({
            success:true,
            user,
        })
        
    }catch(err){
        return next(new ErrorHandler(err.message,400));
    }
})

//update user password
export const updateUserPassword = CatchAsyncError(async(req,res,next)=>{
    try{
        const { oldPassword, newPassword } =req.body;

        const user = await userModel.findById(req.user?._id).select("+password");

        if(!oldPassword || !newPassword){
            return next(new ErrorHandler("Please enter a password",400));
        }

        if(user.password === undefined){
            return next(new ErrorHandler("Invalid User",400));
        }

        const isPasswordMatch = await user?.comparePassword(oldPassword);

        if(!isPasswordMatch){
            return next(new ErrorHandler("Invalid Old Password",400));
        }
        
        user.password = newPassword;

        await user?.save();

        await redis.set(req.user?._id, JSON.stringify(user));

        res.status(201).json({
            success:true,
            user,
        })
    }catch(err){
        return next(new ErrorHandler(err.message,400));
    }
})


// update profile picture
export const updateProfilePicture = CatchAsyncError(
    async (req, res, next) => {
      try {
        const { avatar } = req.body;
  
        const userId = req.user?._id;
        const user = await userModel.findById(userId).select("+password");
  
        if (avatar && user) {
          // if user has an avatar
          if (user?.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

            // delete profile picture and upload new profile picture
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });
  
            user.avatar = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
          } else {
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });

            user.avatar = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
          }
        }
  
        await user?.save();
        await redis.set(userId, JSON.stringify(user));
  
        res.status(200).json({
          success: true,
          user,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  
  // get all users  --- Only for Admin

export const getAllUsers = CatchAsyncError(
  async (req, res, next) => {
    try {
      getAllUsersService(res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// update user roles

export const updateUserRole = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { email, role } = req.body;
      const isUserExist = await userModel.findOne({ email });
      if (isUserExist) {
        const id = isUserExist._id;
        updateUserRoleService(res, id, role);
      } else {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete user --- Only for admin

export const deleteUser = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get userCourses 
export const getUserCourses = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.user._id) // Assuming `req.user` contains the authenticated user
      .populate("courses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      courses: user.courses, // Each course will have _id, name, and description
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
