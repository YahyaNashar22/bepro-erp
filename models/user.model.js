import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: false, unique: true },
        phone: { type: String, required: false, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user', required: true }
    },
    { timestamps: true }
);

const User = model("User", userSchema);

export default User;