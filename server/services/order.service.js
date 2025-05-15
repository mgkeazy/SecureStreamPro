import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import OrderModel from "../models/orderModel.js";



// create new Order

export const newOrder = CatchAsyncError(async(data,res) => {
    const order = await OrderModel.create(data);
    res.status(200).json({
      success:true,
      order,
  })
});

//   // get all orders

export const getAllOrdersService = async (res) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    orders,
  });
};