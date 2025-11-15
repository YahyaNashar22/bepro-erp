import express from "express";
import { uploadImageController, uploadQuotationController } from "../controllers/upload.controller.js";

const uploadRouter = express.Router();

uploadRouter.post("/quotation", uploadQuotationController);
uploadRouter.post("/image", uploadImageController);


export default uploadRouter;