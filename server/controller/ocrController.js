import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { convert } from 'pdf-poppler';

export const extractText = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const fileExt = path.extname(fileName).toLowerCase();

    console.log('File path:', filePath);
    console.log('File name:', fileName);

    let pdfImagePaths = [];

    try {
        let textChunks = [];

        // If PDF, convert to images first
        if (fileExt === '.pdf') {
            console.log('Converting PDF to images...');

            const outputDir = path.dirname(filePath);
            const baseName = path.parse(fileName).name;

            const opts = {
                format: 'png',
                out_dir: outputDir,
                out_prefix: baseName,
                page: null // Convert all pages
            };

            await convert(filePath, opts);

            // Collect all generated images (e.g., originalname-1.png, originalname-2.png, ...)
            pdfImagePaths = fs
                .readdirSync(outputDir)
                .filter(name => name.startsWith(`${baseName}-`) && name.toLowerCase().endsWith('.png'))
                .map(name => path.join(outputDir, name))
                .sort((a, b) => {
                    const getNum = p => {
                        const match = path.basename(p).match(/-(\d+)\.png$/i);
                        return match ? parseInt(match[1], 10) : 0;
                    };
                    return getNum(a) - getNum(b);
                });

            if (pdfImagePaths.length === 0) {
                throw new Error('PDF conversion failed');
            }

            console.log('PDF converted to:', pdfImagePaths.join(', '));

            // Extract text from each page image
            for (const imagePath of pdfImagePaths) {
                const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
                    logger: m => console.log(m)
                });
                textChunks.push(text);
            }
        } else {
            // Non-PDF: Extract text directly from the uploaded file
            const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
                logger: m => console.log(m)
            });
            textChunks.push(text);
        }

        const fullText = textChunks.join('\n');
        // console.log('Extracted text:', fullText);

        // Create data directory if it doesn't exist
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Path to the single JSON file
        const jsonFilePath = path.join(dataDir, 'extracted_data.json');

        // Read existing data or create new array
        let allData = [];
        if (fs.existsSync(jsonFilePath)) {
            const existingContent = fs.readFileSync(jsonFilePath, 'utf-8');
            allData = JSON.parse(existingContent);
        }

        let id = `chat_${Math.random().toString(36).substr(2, 9)}`;

        // Add new entry
        const newEntry = {
            chatId: id,
            fileName: fileName,
            timestamp: new Date().toISOString(),
            documentText: fullText
        };
        allData.push(newEntry);

        // Save back to file
        fs.writeFileSync(jsonFilePath, JSON.stringify(allData, null, 2), 'utf-8');
        console.log('Data appended to:', jsonFilePath);

        // Clean up files
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        for (const imgPath of pdfImagePaths) {
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }

        res.json({ 
            chatId: id,
            text: fullText,
            jsonFile: jsonFilePath 
        });

    } catch (error) {
        console.error('Error extracting text:', error);

        // Clean up files on error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        for (const imgPath of pdfImagePaths) {
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }

        res.status(500).json({
            error: 'Failed to extract text from the uploaded file',
            details: error.message
        });
    }
};