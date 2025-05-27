import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { approveEnrollRequest, getPendingEnrollments } from "../controllers/enrollment.controller.js";
const enrollmentRouter = express.Router();

enrollmentRouter.get('/enrollments/pending',isAuthenticated,authorizeRoles("admin"), getPendingEnrollments);
enrollmentRouter.post('/enrollments/:enrollmentId/approve', isAuthenticated, authorizeRoles("admin"), approveEnrollRequest);

export default enrollmentRouter