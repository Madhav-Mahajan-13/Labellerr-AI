import { GoogleGenerativeAI } from "@google/generative-ai";
import { getExtractedDataByChatId } from "./helperfuctions.js";
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const chatFunction = async (req, res) => {
    try {
        const { chat_id, message } = req.body;
        
        // Check for chat_id and message
        if (!chat_id || !message) {
            return res.status(400).json({ error: 'Missing chat_id or message' });
        }

        const extractedData = getExtractedDataByChatId(chat_id);
        if (!extractedData) {
            return res.status(404).json({ error: 'Chat ID not found' });
        }

        const documentText = extractedData.documentText;


        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const prompt = `You are a helpful assistant answering questions based on the following document.

Document Content:
${documentText}

User Question: ${message}

Please provide a helpful and accurate response based on the document content above. If the question cannot be answered from the document, please state that clearly.`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        return res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error generating AI response:', error);
        return res.status(500).json({ 
            error: 'Failed to generate AI response',
            details: error.message 
        });
    }
}