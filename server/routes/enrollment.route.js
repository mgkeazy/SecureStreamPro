import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { getPendingEnrollments } from "../controllers/enrollment.controller.js";
const enrollmentRouter = express.Router();

enrollmentRouter.get('/enrollments/pending',isAuthenticated,authorizeRoles("admin"), getPendingEnrollments)

export default enrollmentRouter