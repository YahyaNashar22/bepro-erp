import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import databaseConnection from "./db/dbConnection.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 5000;

app.get(
    "/health", (req, res) => res.send("<h1>server running</h1>")
);

io.on(
    "connection",
    (socket) => {
        // connection event
        console.log("a user connected");
        // disconnection event
        socket.on("disconnect", () => console.log("a user disconnected"));
    }
);

server.listen(port, () => {
    console.log("listening on port", port);
});

databaseConnection();