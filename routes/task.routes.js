import express from "express";
import { createClient, deleteClient, editClient, getAllClients } from "../controllers/client.controller.js";

const taskRouter = express.Router();

taskRouter.post("/create", createClient);
taskRouter.post("/all", getAllClients);
taskRouter.patch("/edit", editClient);
taskRouter.delete("/delete", deleteClient);

export default taskRouter;
