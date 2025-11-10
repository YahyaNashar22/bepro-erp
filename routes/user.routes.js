import express from "express";

import { createUser, getAllUsers } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.get("/all", getAllUsers);

export default userRouter;