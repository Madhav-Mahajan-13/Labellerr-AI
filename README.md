# Document Intelligence Chat System

A web-based document intelligence system that allows users to upload documents (images or PDFs), extract text using OCR technology, and interact with the extracted content through an AI-powered chat interface.

![Project Banner](https://img.shields.io/badge/Status-Completed-success)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![OCR](https://img.shields.io/badge/OCR-Tesseract.js-blue)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## 🎯 Overview

This project was developed as part of a technical assignment for the Software Engineering Intern (AI/Computer Vision) position. The system demonstrates the integration of OCR technology and AI-powered natural language processing to create an intelligent document interaction platform.


## ✨ Features

### Core Functionality
- ✅ **Document Upload** - Support for JPG, PNG, PDF, and WEBP formats
- ✅ **OCR Text Extraction** - Automated text extraction using Tesseract.js
- ✅ **AI-Powered Chat** - Natural language queries about document content
- ✅ **Document Management** - JSON-based data persistence
- ✅ **Multi-page PDF Support** - Handles PDF documents with multiple pages
- ✅ **Chat History** - Maintains conversation context per document

### Backend Features
- RESTful API with Express.js
- File upload with Multer middleware
- Automatic file validation and size limits (5MB)
- PDF to image conversion using pdf-poppler
- Persistent storage with JSON file system
- Comprehensive error handling
- CORS configuration for frontend integration

### Frontend Features
- File upload interface 
- Extracted text display
- Interactive chat interface
- Message history display
- Real-time AI responses

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **File Upload:** Multer
- **OCR Engine:** Tesseract.js
- **PDF Processing:** pdf-poppler
- **AI Platform:** Google Gemini (gemini-3-flash-preview)
- **Data Storage:** JSON file-based storage

### Additional Libraries
- `@google/generative-ai` - Gemini AI integration
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variable management

## 🏗 Architecture

```
User Interface (Frontend)
         ↓
   File Upload
         ↓
Backend API (Express.js)
         ↓
   OCR Processing (Tesseract.js)
         ↓
Text Storage (JSON file)
         ↓
User Query → AI API (Gemini) → Response
         ↓
Display in Chat Interface
```

### Data Flow
1. User uploads document (image/PDF) through API endpoint
2. Multer handles file upload and validation
3. For PDFs: Convert to images using pdf-poppler
4. Tesseract.js extracts text from images
5. Extracted text stored in JSON with unique chat ID
6. User sends queries via chat endpoint
7. Gemini AI processes queries using document context
8. AI responses returned to user

## 📁 Project Structure

```
document-intelligence-system/
├── document chat frontend/
├── server/
│   ├── controller/
│   │   ├── ocrController.js      # OCR and text extraction logic
│   │   ├── chatController.js     # AI chat integration
│   │   └── helperfuctions.js     # Utility functions
│   ├── routes/
│   │   └── Route.js              # API route definitions
│   ├── data/
│   │   └── extracted_data.json   # Persistent document storage
│   ├── uploads/                  # Temporary file storage
│   ├── multerConfig.js           # File upload configuration
│   ├── index.js                  # Application entry point
│   ├── .env                      # Environment variables
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Google Gemini API key ([Get it here](https://aistudio.google.com/app/apikey))
- pdf-poppler (for PDF processing)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-intelligence-system
   ```

2. **Navigate to server directory**
   ```bash
   cd server
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Install pdf-poppler (System dependency)**
   
   **Windows:**
   - Download from [poppler for Windows](http://blog.alivate.com.au/poppler-windows/)
   - Extract and add to system PATH
   
   **macOS:**
   ```bash
   brew install poppler
   ```
   
   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt-get install poppler-utils
   ```

5. **Configure environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. **Create required directories**
   ```bash
   mkdir uploads data
   ```

7. **Start the server**
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:5000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Upload Document & Extract Text

**Endpoint:** `POST /api/ocr`

**Description:** Upload a document and extract text using OCR

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file` (required): Document file (JPG, PNG, PDF, WEBP)

**Example using PostMan:**
<img width="1915" height="1018" alt="image" src="https://github.com/user-attachments/assets/fe7b4261-d3ae-4f12-8bb9-be8dbfb6d60f" />


---

#### 2. Chat with Document

**Endpoint:** `POST /api/ai-chat`

**Description:** Send queries about the uploaded document and receive AI-powered responses

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "chat_id": "chat_8uv3duhku",
    "message": "What is the main topic of this document?"
  }
  ```

**Example using PostMan:**
<img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/4988c9cd-6431-46a3-bda7-1c431e5358a3" />


---

#### 3. Health Check

**Endpoint:** `GET /`

**Description:** Check if the server is running

**Response (200):**
```json
{
  "status": "ok",
  "port": 5000
}
```

## ⚙️ Environment Configuration

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### Getting API Keys

**Google Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

**Free Tier Limits:**
- 1,500 requests per day
- Suitable for development and testing



### Helper Function for Chat
```javascript
function getExtractedDataByChatId(chatId) {
    try {
        if (!fs.existsSync(jsonFilePath)) {
            return null;
        }
        const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
        const allData = JSON.parse(fileContent);
        return allData.find(item => item.chatId === chatId) || null;
    } catch (error) {
        console.error('Error reading extracted data:', error);
        throw new Error('Failed to read extracted data');
    }
}
```

## 🎯 Technical Decisions

### 1. OCR Solution: Tesseract.js

**Reasoning:**
- ✅ **No API Key Required** - Simplifies setup and deployment
- ✅ **Direct Node.js Integration** - No need for Python service
- ✅ **Free and Open Source** - No usage limits or costs
- ✅ **Good Accuracy** - Suitable for standard documents
- ✅ **Active Community** - Well-maintained and documented

**Trade-offs:**
- Slightly lower accuracy compared to EasyOCR for complex documents
- Processing speed depends on client hardware

### 2. AI Platform: Google Gemini

**Reasoning:**
- ✅ **Generous Free Tier** - 1,500 requests/day
- ✅ **Fast Response Times** - Suitable for real-time chat
- ✅ **Good Context Understanding** - Handles document queries well
- ✅ **Easy Integration** - Official Node.js SDK available
- ✅ **Latest Model** - gemini-3-flash-preview offers good performance

**Model Selection:**
- Using `gemini-3-flash-preview` for balance of speed and accuracy
- Flash variant optimized for quick responses

### 3. Data Storage: JSON File

**Reasoning:**
- ✅ **Simple Implementation** - No database setup required
- ✅ **Human Readable** - Easy to debug and inspect
- ✅ **Sufficient for Assignment** - Meets requirements
- ✅ **No Dependencies** - Uses native Node.js fs module

**Future Improvements:**
- For production: Consider MongoDB or PostgreSQL
- For scalability: Implement database indexing
- For multi-user: Add authentication and user isolation

### 4. PDF Processing: pdf-poppler

**Reasoning:**
- ✅ **Reliable Conversion** - Industry-standard tool
- ✅ **High Quality Output** - Preserves document fidelity
- ✅ **Multi-page Support** - Handles complex documents
- ✅ **Well Tested** - Stable and mature library

## 🚧 Challenges & Solutions

### Challenge 1: PDF Multi-page Processing

**Problem:** Initial implementation only processed the first page of PDFs.

**Solution:**
- Implemented page-by-page conversion using pdf-poppler
- Collected all generated PNG images
- Sorted images by page number using regex
- Concatenated extracted text from all pages

```javascript
// Sort by page number
.sort((a, b) => {
    const getNum = p => {
        const match = path.basename(p).match(/-(\d+)\.png$/i);
        return match ? parseInt(match[1], 10) : 0;
    };
    return getNum(a) - getNum(b);
});
```

### Challenge 2: File Path Handling

**Problem:** Hard-coded absolute paths in `helperfuctions.js` caused portability issues.

**Current Implementation:**
```javascript
const jsonFilePath = 'C:/Users/Madhav/OneDrive/Desktop/main_project/Labellerr AI/server/data/extracted_data.json';
```

**Recommended Solution:**
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jsonFilePath = path.join(__dirname, '../data/extracted_data.json');
```

### Challenge 3: File Cleanup

**Problem:** Uploaded files and temporary PDF conversion images needed cleanup.

**Solution:**
- Implemented cleanup in both success and error paths
- Remove original uploaded file after processing
- Remove all PDF-generated images after OCR
- Prevents disk space issues

```javascript
// Clean up files
if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
}
for (const imgPath of pdfImagePaths) {
    if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
    }
}
```


### Challenge 5: CORS Configuration

**Problem:** Frontend requests blocked by CORS policy.

**Solution:**
- Configured comprehensive CORS options
- Allowed specific frontend origin
- Enabled credentials for future auth
- Supported all necessary HTTP methods

```javascript
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
```

## 📸 Screenshots

### 1. Server Running
```
Server is running on port 5000
```
<img width="1919" height="980" alt="image" src="https://github.com/user-attachments/assets/c6e7493f-2907-4f9d-8f55-776d5df78b96" />

### 2. Successful Document Upload
```json
{
    "chatId": "chat_7mfqal5g9",
    "text": "Priyanka slams PM over Epstein row no-\nshow\n\n- Opposition accuses PM of avoiding debate\n\n- Congress pushes Epstein files discussion\n\n+ Rahul Gandhi alleges PM is compromised\n\n« Speaker cites security threat, Priyanka calls it a lie |\n",
    "jsonFile": "C:\\Users\\Madhav\\OneDrive\\Desktop\\main_project\\Labellerr AI\\server\\data\\extracted_data.json"
}
```
<img width="861" height="829" alt="image" src="https://github.com/user-attachments/assets/53ea6f39-34f8-4661-968d-ba5cf947b4d0" />


### 3. AI Chat Response
```json
{
  "response": "Based on the document, Priyanka is criticizing the Prime Minister for not showing up to a debate regarding the Epstein controversy. The opposition has accused the PM of avoiding the debate, while Congress is pushing for a discussion on the Epstein files..."
}
```
<img width="1181" height="876" alt="image" src="https://github.com/user-attachments/assets/718db226-2578-4e88-8e35-5f0627eba0f6" />

### 4. Data Storage (extracted_data.json)
```json
[
  {
    "chatId": "chat_8uv3duhku",
    "fileName": "1770365803037-694243824.png",
    "timestamp": "2026-02-06T08:16:43.659Z",
    "documentText": "Priyanka slams PM over Epstein row no-show..."
  }
]
```

## 🧪 Testing

### Using Postman

1. **Test Document Upload**
   - Method: POST
   - URL: `http://localhost:5000/api/ocr`
   - Body: form-data
   - Key: `file` (type: File)
   - Select your document file

2. **Test Chat Functionality**
   - Method: POST
   - URL: `http://localhost:5000/api/ai-chat`
   - Body: raw (JSON)
   ```json
   {
     "chat_id": "chat_8uv3duhku",
     "message": "What is this document about?"
   }
   ```



## 📚 Documentation & Resources

### API Documentation
- [Google Gemini API](https://ai.google.dev/tutorials/get_started_node)
- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)

### Technical References
- [Express.js Guide](https://expressjs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [pdf-poppler npm](https://www.npmjs.com/package/pdf-poppler)

## 📄 License

This project is created for educational and assignment purposes.

## 👨‍💻 Author

MADHAV MAHAJAN


---



---

**Note:** This project was completed as part of a technical assignment within the 48-hour deadline. All core functionality has been implemented and tested successfully.
