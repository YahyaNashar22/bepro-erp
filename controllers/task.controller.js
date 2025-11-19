import { io } from "../index.js";

import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
    try {

        const { name, description, assignee, project_id, deadline, files, price } = req.body;

        const task = new Task({ name, description, assignee, project_id, deadline, files, price });
        await task.save();

        io.emit("task_created", task);

        return res.status(201).json({ message: "task created", payload: task })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error creating task", error: error.message });
    }
}


export const getAllTasks = async (req, res) => {
    try {

        const tasks = await Task.find().sort({ createdAt: -1 });
        return res.status(200).json({ message: "fetched successfully", payload: tasks });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error fetching tasks", error: error.message });
    }
}


export const editTask = async (req, res) => {
    try {
        const { taskId, name, description, assignee, project_id, deadline, files, price } = req.body;

        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ message: "task does not exist" });

        const editedTask = await Task.findByIdAndUpdate(taskId, { taskId, name, description, assignee, project_id, deadline, files, price }, { new: true });

        io.emit("task_updated", editedTask);

        return res.status(200).json({ message: "edited successfully", payload: editedTask });


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error editing task", error: error.message });
    }
}


export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.body;

        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ message: "task does not exist" });

        const deletedTask = await Task.findByIdAndDelete(taskId);

        io.emit("task_deleted", deletedTask);

        return res.status(200).json({ message: "deleted successfully", payload: deletedTask });


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error deleting task", error: error.message });
    }
}
