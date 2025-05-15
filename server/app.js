import express from "express";
import { config } from "dotenv";
export const app= express();
import cors from "cors"
import cookieParser from "cookie-parser";
import {Errormiddleware} from "./middlewares/error.js"
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.route.js";
import orderRouter from "./routes/order.route.js";
import notificationRouter from "./routes/notification.route.js";
import vdoCipherRouter from "./routes/vdoCipher.route.js";
import enrollmentRouter from "./routes/enrollment.route.js";
config()

app.use(express.json({limit:"50mb"}));

app.use(cookieParser());

app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}));


app.use("/api/v1",userRouter, courseRouter, orderRouter, notificationRouter, vdoCipherRouter, enrollmentRouter)

// testing api
app.get("/test", (req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"API is working"
    })
})

app.use(Errormiddleware)

