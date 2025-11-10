import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

import databaseConnection from "./db/dbConnection.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());


const port = process.env.PORT || 5000;

// health status
app.get(
    "/health", (req, res) => res.send("<h1>server running</h1>")
);

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
app.use("/user", userRouter);

server.listen(port, () => {
    console.log("listening on port", port);
});

databaseConnection();