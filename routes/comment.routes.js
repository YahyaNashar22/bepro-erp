import express from "express";
import { createComment, deleteComment, editComment, getAllComments } from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/create", createComment);
commentRouter.post("/all", getAllComments);
commentRouter.patch("/edit", editComment);
commentRouter.delete("/delete", deleteComment);

export default commentRouter;
