import { redis } from "../utils/redis.js";
import userModel from "../models/user.model.js";
import { CatchAsyncError } from "../middlewares/catchAsyncError.js";

// get user by id
export const getUserById = async (id, res) => {
  const userJson = await redis.get(id);

  const user = JSON.parse(userJson);
  res.status(201).json({
    success: true,
    user
  });
};

// get all users

export const getAllUsersService = async (res) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};

// update user role

export const updateUserRoleService = async (res, id, role) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
  res.status(201).json({
    success: true,
    user,
  });
};


 