import { config } from "dotenv";
config();

import { fileURLToPath } from "url";
import { CatchAsyncError } from "../middlewares/catchAsyncError.js";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import path from "path";
import ejs from "ejs"
import sendMail from "../utils/sendMail.js";
import { redis } from "../utils/redis.js";
import NotificationModel from "../models/notificationModel.js";
import { getAllOrdersService, newOrder } from "../services/order.service.js";

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// create order
export const CreateOrder = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { courseId, payment_info } = req.body;

    //   if (payment_info) {
    //     if ("id" in payment_info) {
    //       const paymentIntentId = payment_info.id;
    //       const paymentIntent = await stripe.paymentIntents.retrieve(
    //         paymentIntentId
    //       );

    //       if (paymentIntent.status !== "succeeded") {
    //         return next(new ErrorHandler("Payment not authorized!", 400));
    //       }
    //     }
    //   }

      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (course) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 400));
      }

      const data = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
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

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

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

      user?.courses.push(course?._id);

      await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        userId: user?._id,
        title: " New Order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased = course.purchased + 1;

      await course.save();

      newOrder(data, res, next);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all orders --only for admin
export const getAllOrders = CatchAsyncError(
  async (req, res, next) => {
    try {
      getAllOrdersService(res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// //  send stripe publishble key
// export const sendStripePublishableKey = CatchAsyncError(
//   async (req: Request, res: Response) => {
//     res.status(200).json({
//       publishablekey: process.env.STRIPE_PUBLISHABLE_KEY
//     });
//   }
// );

// // new payment
// export const newPayment = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const myPayment = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "USD",
//         description: "LearnInO course services",
//         metadata: {
//           company: "LearnInO",
//         },
//         automatic_payment_methods: {
//           enabled: true,
//         },
//         shipping: {
//           name: "LearnInO Official",
//           address: {
//             line1: "510 Townsend St",
//             postal_code: "98140",
//             city: "San Francisco",
//             state: "CA",
//             country: "US",
//           },
//         },
//       });
//       res.status(201).json({
//         success: true,
//         client_secret: myPayment.client_secret,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );