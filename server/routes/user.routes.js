import express from 'express'
import { activateUser, deleteUser, getAllUsers, getUserCourses, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updateProfilePicture, updateUserInfo, updateUserPassword, updateUserRole } from '../controllers/user.controller.js';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.js';
const userRouter = express.Router()

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login-user', loginUser);

userRouter.get('/logout', isAuthenticated, logoutUser);

userRouter.get("/refresh", updateAccessToken)

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.post("/socialAuth", socialAuth);

userRouter.put("/update-user-info", isAuthenticated,updateUserInfo);

userRouter.put("/update-user-password", isAuthenticated,updateUserPassword);

userRouter.put("/update-user-avatar", isAuthenticated,updateProfilePicture)

userRouter.get("/get-users", isAuthenticated,authorizeRoles("admin"), getAllUsers)

userRouter.get("/get-user-courses", isAuthenticated, getUserCourses)

userRouter.put(
    "/update-user-role",
    isAuthenticated,
    authorizeRoles("admin"),
    updateUserRole
);

userRouter.delete(
    "/delete-user/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteUser
  );

export default userRouter