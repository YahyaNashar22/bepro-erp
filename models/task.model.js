import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        assignee: { type: Schema.Types.ObjectId, ref: "User", required: false },
        project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        deadline: { type: Date, required: false },
        files: [{ type: String, required: false }],
        price: { type: String, required: false }
    },
    {
        timestamps: true
    }
);

const Task = model("Task", taskSchema);
export default Task;