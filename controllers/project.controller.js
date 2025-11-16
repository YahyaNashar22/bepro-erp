import { io } from "../index.js";
import Comment from "../models/comment.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const createProject = async (req, res) => {
    try {

        const { name, description, type, source, source_info, status, quotation, price, files, currency, responsible, client_id } = req.body;

        const project = new Project({ name, description, type, source, source_info, status, quotation, price, files, currency, responsible, client_id });
        await project.save();

        io.emit("project_created", project);

        return res.status(201).json({ message: "project created", payload: project })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error creating project", error: error.message });
    }
}


export const getAllProjects = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "user does not exist" });

        if (user.role === "admin") {
            const projects = await Project.find().populate(["responsible", "client_id"]).sort({ createdAt: -1 });
            return res.status(200).json({ message: "fetched successfully", payload: projects });
        } else {
            const projects = await Project.find({ responsible: userId }).populate(["responsible", "client_id"]).sort({ createdAt: -1 });
            return res.status(200).json({ message: "fetched successfully", payload: projects });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error fetching projects", error: error.message });
    }
}


export const editProject = async (req, res) => {
    try {
        const { userId, projectId, name, description, type, source, source_info, status, quotation, price, files, currency, responsible, client_id } = req.body;

        const user = await User.findById(userId);
        const project = await Project.findById(projectId);

        if (!user) return res.status(404).json({ message: "user does not exist" });
        if (!project) return res.status(404).json({ message: "project does not exist" });

        if (user.role === "admin") {
            const editedProject = await Project.findByIdAndUpdate(projectId, { name, description, type, source, source_info, status, quotation, price, files, currency, responsible, client_id }, { new: true });

            io.emit("project_updated", editedProject);

            return res.status(200).json({ message: "edited successfully", payload: editedProject });
        } else {

            return res.status(401).json({ message: "Not Authorized" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error editing project", error: error.message });
    }
}


export const deleteProject = async (req, res) => {
    try {
        const { userId, projectId } = req.body;

        const user = await User.findById(userId);
        const project = await Project.findById(projectId);

        if (!user) return res.status(404).json({ message: "user does not exist" });
        if (!project) return res.status(404).json({ message: "project does not exist" });

        if (user.role === "admin") {

            await Task.deleteMany({ project_id: projectId });

            await Comment.deleteMany({ project_id: projectId });

            const deleteProject = await Project.findByIdAndDelete(projectId);

            io.emit("project_deleted", deleteProject);

            return res.status(200).json({ message: "deleted successfully", payload: deleteProject });
        } else {

            return res.status(401).json({ message: "Not Authorized" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error deleting project", error: error.message });
    }
}