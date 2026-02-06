import { getExtractedDataByChatId } from "./helperfuctions.js";

export const chatFunction = async (req, res) =>{
    const { chat_id, message } = req.body;
    
    // check for chat_id 

    if (!chat_id || !message) {
        return res.status(400).json({ error: 'Missing chat_id or message' });
    }
   const extractedData = getExtractedDataByChatId(chat_id);
   if(!extractedData){
    return res.status(404).json({ error: 'Chat ID not found' });
   }
   const documentText = extractedData.documentText;

   // Here you can integrate with your AI model to generate a response based on documentText and message
   // For demonstration, we'll just echo back the document text and user message

    const aiResponse = `Document Text: ${documentText}\nUser Message: ${message}`;
    return res.json({ response: aiResponse });  
}