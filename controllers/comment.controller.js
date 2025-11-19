import { io } from "../index.js";

import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";


export const createComment = async (req, res) => {
    try {

        const { text, user_id, project_id, task_id } = req.body;

        const comment = new Comment({ text, user_id, project_id, task_id });
        await comment.save();

        io.emit("comment_created", comment);

        return res.status(201).json({ message: "comment created", payload: comment })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error creating comment", error: error.message });
    }
}


export const getAllComments = async (req, res) => {
    try {

        const comments = await Comment.find().sort({ createdAt: -1 });
        return res.status(200).json({ message: "fetched successfully", payload: comments });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error fetching comments", error: error.message });
    }
}


export const editComment = async (req, res) => {
    try {
        const { userId, commentId, name, phone, address, email, company_name } = req.body;

        const user = await User.findById(userId);
        const comment = await Comment.findById(commentId);

        if (!user) return res.status(404).json({ message: "user does not exist" });
        if (!comment) return res.status(404).json({ message: "comment does not exist" });

        if (userId === comment.user_id) {

            const editedComment = await Comment.findByIdAndUpdate(commentId, { userId, commentId, name, phone, address, email, company_name }, { new: true });

            io.emit("comment_updated", editedComment);

            return res.status(200).json({ message: "edited successfully", payload: editedComment });
        } else {

            return res.status(401).json({ message: "Not Authorized" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error editing comment", error: error.message });
    }
}


export const deleteComment = async (req, res) => {
    try {
        const { userId, commentId } = req.body;

        const user = await User.findById(userId);
        const comment = await Comment.findById(commentId);

        if (!user) return res.status(404).json({ message: "user does not exist" });
        if (!comment) return res.status(404).json({ message: "comment does not exist" });

        if (userId === comment.user_id) {

            const deletedComment = await Comment.findByIdAndDelete(commentId);

            io.emit("comment_deleted", deletedComment);

            return res.status(200).json({ message: "deleted successfully", payload: deletedComment });
        } else {

            return res.status(401).json({ message: "Not Authorized" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error deleting comment", error: error.message });
    }
}
