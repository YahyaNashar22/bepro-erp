import express from "express";

import { changePassword, changeRole, createUser, getAllUsers, login, logout, refreshToken } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/refresh", refreshToken);
userRouter.post("/all", getAllUsers);
userRouter.patch("/change-role", changeRole);
userRouter.patch("/change-password", changePassword);

export default userRouter;