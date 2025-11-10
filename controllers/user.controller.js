import bcrypt from "bcryptjs";

import User from "../models/user.model.js"

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

        if (!user) return res.status(404).json({message: "user not found!"});

        const isCorrectCredentials =  bcrypt.compareSync(password, user.password);

        if (!isCorrectCredentials) return res.status(400).json({message: "incorrect password"});

        

        return res.status(200).json({
            message: "login successful",
        })

    } catch (error) {
        return res.status(500).json({
            message: `problem logging in: ${error.message}`,
            error: error
        })
    }
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