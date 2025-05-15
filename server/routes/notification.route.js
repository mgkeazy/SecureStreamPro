import express from "express"
const notificationRouter = express.Router();
import { isAuthenticated , authorizeRoles } from "../middlewares/auth.js"
import {getNotifications, updateNotification} from "../controllers/notification.controller.js"

notificationRouter.get("/get-all-notifications", isAuthenticated ,authorizeRoles("admin"),getNotifications)

notificationRouter.put("/update-notification/:id",isAuthenticated,authorizeRoles("admin"),updateNotification)

export default notificationRouter;