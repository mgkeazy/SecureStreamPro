import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import NotificationModel from "../models/notificationModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cron from "node-cron"

// get all notifications -- Only for Admin
export const getNotifications = CatchAsyncError(
  async (req, res, next) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update notification status -- only for Admin

export const updateNotification = CatchAsyncError(
  async (req, res, next) => {
    try {
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Invalid notification id", 400));
      } else {
        notification.status
          ? (notification.status = "read")
          : notification.status;
      }

      await notification.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// delete notification -- only for Admin

cron.schedule("0 0 0 * * *", async() =>{
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({status: "read", createdAt:{$lt: thirtyDaysAgo}});
  console.log('Deleted Read Notifications');
});
