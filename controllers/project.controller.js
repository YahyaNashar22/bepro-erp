import { io } from "../index.js";
import Comment from "../models/comment.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { deleteFile, deleteFiles } from "../utils/deleteFiles.js";

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
            // delete previous quotation file
            if (quotation) {
                deleteFile(project.quotation);
            }
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

            // 1. Delete project quotation file
            await deleteFile(project.quotation);

            // 2. Delete project-level files
            await deleteFiles(project.files);

            // 3. Get tasks belonging to this project (to delete their files)
            const tasks = await Task.find({ project_id: projectId });

            // 4. Extract all file paths from tasks
            const taskFiles = tasks
                .filter(t => Array.isArray(t.files))
                .flatMap(t => t.files);

            // 5. Delete task-level files (if any)
            await deleteFiles(taskFiles);

            // 6. Delete comments belonging to tasks
            await Comment.deleteMany({ task_id: { $in: taskIds } });

            // 7. Delete tasks
            await Task.deleteMany({ project_id: projectId });

            // 8. Delete comments belonging directly to the project
            await Comment.deleteMany({ project_id: projectId });

            // 9. Delete project
            const deletedProject = await Project.findByIdAndDelete(projectId);

            io.emit("project_deleted", deletedProject);

            return res.status(200).json({ message: "deleted successfully", payload: deletedProject });
        } else {

            return res.status(401).json({ message: "Not Authorized" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error deleting project", error: error.message });
    }
}


export const deleteProjectFile = async (req, res) => {
    try {
        const { projectId, fileUrl } = req.body;

        if (!projectId || !fileUrl) {
            return res.status(400).json({ message: "projectId and fileUrl are required" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if file exists in project.files
        if (!project.files.includes(fileUrl)) {
            return res.status(404).json({ message: "File does not exist in this project" });
        }

        // Remove file from array
        project.files = project.files.filter(f => f !== fileUrl);

        // Delete the actual file
        await deleteFile(fileUrl);

        // Save project
        await project.save();

        // Emit socket event
        io.emit("project_file_deleted", project);

        return res.status(200).json({
            message: "File deleted successfully",
            payload: project
        });

    } catch (error) {
        console.error("Error deleting project file:", error.message);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};