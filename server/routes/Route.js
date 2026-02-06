import express from "express";
import upload from "../multerConfig.js"
import { extractText } from "../controller/ocrController.js";
import { chatFunction } from "../controller/chatController.js";

const ocrRouter = express.Router();

ocrRouter.post("/ocr", upload.single('file'), extractText);
ocrRouter.post('/ai-chat', chatFunction);

export default ocrRouter;