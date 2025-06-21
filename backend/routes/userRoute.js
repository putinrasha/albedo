import express from 'express';
import { loginUser, registerUser, updateUser, getAllUsers, updateUserAdminStatus, getUserById } from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/update", updateUser);
userRouter.get("/all", getAllUsers);
userRouter.post("/updateadmin", updateUserAdminStatus);
userRouter.get("/getuser", getUserById);

export default userRouter;
