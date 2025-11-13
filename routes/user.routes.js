import express from "express";

import { createUser, getAllUsers, login, logout, refreshToken } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/refresh", refreshToken);
userRouter.get("/all", getAllUsers);

export default userRouter;