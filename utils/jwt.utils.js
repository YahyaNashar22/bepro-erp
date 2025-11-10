import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Access token ( short-lived )
export const signAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};

// Refresh token ( long-lived )
export const signRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
}

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_TOKEN_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_TOKEN_SECRET);