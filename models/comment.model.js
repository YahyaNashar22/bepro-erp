import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
    {
        text: { type: String, required: true },
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        project_id: { type: Schema.Types.ObjectId, ref: "Project", required: false },
        task_id: { type: Schema.Types.ObjectId, ref: "Task", required: false },
    },
    {
        timeStamps: true
    }
);

// Enforce "either project_id OR task_id must exist, but not both"
commentSchema.pre("validate", function (next) {
    const hasProject = !!this.project_id;
    const hasTask = !!this.task_id;

    if (!hasProject && !hasTask) {
        return next(new Error("Either project_id or task_id is required."));
    }

    if (hasProject && hasTask) {
        return next(new Error("Only one of project_id or task_id can be provided."));
    }

    next();
});

const Comment = model("Comment", commentSchema);
export default Comment;