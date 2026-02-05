import Tesseract from 'tesseract.js';
import fs from 'fs';

export const extractText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' }); 
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;

    console.log('File path:', filePath);
    console.log('File name:', fileName);
    
    try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
            logger: m => console.log(m)
        });
        console.log('Extracted text:', text);
        
        // Clean up the uploaded file after processing
        fs.unlinkSync(filePath);
        
        res.json({ text });
    } catch (error) {
        console.error('Error extracting text:', error);
        
        // Clean up file even if extraction fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.status(500).json({ error: 'Failed to extract text from the uploaded file' });
    }
};