import express from "express";
import { createProject, deleteProject, editProject, getAllProjects } from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.post("/create", createProject);
projectRouter.post("/all", getAllProjects);
projectRouter.patch("/edit", editProject);
projectRouter.delete("/delete", deleteProject);

export default projectRouter;
