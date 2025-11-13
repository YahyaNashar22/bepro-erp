import bcrypt from "bcryptjs";

import User from "../models/user.model.js"
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/jwt.utils.js";

// create user 
export const createUser = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({ username, password: hashedPassword, email, role });
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