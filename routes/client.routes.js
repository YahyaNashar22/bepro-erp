import express from "express";
import { createClient, deleteClient, editClient, getAllClients } from "../controllers/client.controller.js";

const clientRouter = express.Router();

clientRouter.post("/create", createClient);
clientRouter.post("/all", getAllClients);
clientRouter.patch("/edit", editClient);
clientRouter.delete("/delete", deleteClient);

export default clientRouter;
