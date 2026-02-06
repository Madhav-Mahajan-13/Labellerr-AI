import fs from 'fs';
import path from 'path';

const jsonFilePath =
          'C:/Users/Madhav/OneDrive/Desktop/main_project/Labellerr AI/server/data/extracted_data.json';


export function getAllExtractedData() {
    try {

        console.log('Checking:', jsonFilePath);

        if (!fs.existsSync(jsonFilePath)) {
            console.log('File not found');
            return [];
        }

        const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
        return JSON.parse(fileContent);

    } catch (error) {
        console.error('Error reading extracted data:', error);
        throw new Error('Failed to read extracted data');
    }
}
 export function getExtractedDataByChatId(chatId) {
    try {


        // File does not exist
        if (!fs.existsSync(jsonFilePath)) {
            return null;
        }

        const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
        const allData = JSON.parse(fileContent);

        // Find matching chatId
        return allData.find(item => item.chatId === chatId) || null;

    } catch (error) {
        console.error('Error reading extracted data:', error);
        throw new Error('Failed to read extracted data');
    }
}

// console.log('', getExtractedDataByChatId('chat_7mfqal5g9'));


