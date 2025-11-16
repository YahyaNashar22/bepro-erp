import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import databaseConnection from "./db/dbConnection.js";

import userRouter from "./routes/user.routes.js";
import uploadRouter from "./routes/upload.routes.js";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    origin: ["http://localhost:5173"],
    credentials: true,
});

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


const port = process.env.PORT || 5000;

// health status
app.get("/health", (req, res) => res.send("<h1>server running</h1>"));

// socket events
io.on(
    "connection",
    (socket) => {
        // connection event
        console.log("a user connected");
        // disconnection event
        socket.on("disconnect", () => console.log("a user disconnected"));
    }
);

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/upload", uploadRouter)

server.listen(port, () => {
    console.log("listening on port", port);
});

databaseConnection();