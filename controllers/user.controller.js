import bcrypt from "bcryptjs";

import User from "../models/user.model.js"
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/jwt.utils.js";

// create user 
export const createUser = async (req, res) => {
    try {
        const { username, password, email, role, phone } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({ username, password: hashedPassword, email, role, phone });
        await user.save();

        return res.status(201).json({
            message: "user created successfully",
            payload: user
        })

    } catch (error) {
        return res.status(500).json({
            message: `problem creating user: ${error.message}`,
            error: error
        })
    }
}

// login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ message: "user not found!" });

        const isCorrectCredentials = bcrypt.compareSync(password, user.password);

        if (!isCorrectCredentials) return res.status(400).json({ message: "incorrect password" });

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        return res
            .cookie(
                "bepro_erp_access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            })
            .cookie(
                "bepro_erp_refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({
                message: "login successful",
                accessToken,
                payload: user
            })

    } catch (error) {
        return res.status(500).json({
            message: `problem logging in: ${error.message}`,
            error: error
        })
    }
}


export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.bepro_erp_refresh_token;
        if (!token) return res.status(401).json({ message: "Missing refresh token" });

        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200)
            .json({
                message: "fetched login user",
                payload: user,
            })

    } catch (error) {
        res.status(403).json({
            message: "Invalid or expired refresh token",
            error: error
        });
    }
}

export const logout = (req, res) => {
    res.clearCookie("bepro_erp_refresh_token", { path: "/" })
        .status(200)
        .json({ message: "Logged out successfully" });
}


// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            message: "users fetched",
            payload: users
        })

    } catch (error) {
        return res.status(500).json({
            message: `problem getting users: ${error.message}`,
            error: error
        })
    }
}


export const changeRole = async (req, res) => {
    try {
        const { operatorId, userId, role } = req.body;

        const operator = await User.findById(operatorId);

        if (!operator) return res.status(404).json({ message: "admin account not found" });
        if (operator.role !== "admin") return res.status(401).json({ message: "not authorized to change role" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "user account not found" });

        user.role = role;
        await user.save();

        return res.status(200).json({
            message: "user role updated",
            payload: user
        })

    } catch (error) {
        return res.status(500).json({
            message: `problem updating user role: ${error.message}`,
            error: error
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "user account not found" });

        const isCorrectCredentials = bcrypt.compareSync(oldPassword, user.password);

        if (!isCorrectCredentials) return res.status(400).json({ message: "incorrect password" });

        const salt = bcrypt.genSaltSync(10);
        const NewHashedPassword = bcrypt.hashSync(newPassword, salt);

        user.password = NewHashedPassword;
        await user.save();

        return res.status(200).json({
            message: "user password changed",
            payload: user
        })

    } catch (error) {
        return res.status(500).json({
            message: `problem changing user password: ${error.message}`,
            error: error
        })
    }
}