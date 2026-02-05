import express from "express";
import upload from "../multerConfig.js"
import { extractText } from "../controller/UploadController.js";

const ocrRouter = express.Router();

ocrRouter.post("/ocr", upload.single('file'), extractText);

export default ocrRouter;