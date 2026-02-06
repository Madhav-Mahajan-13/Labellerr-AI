import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import ocrRouter from './routes/Route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin:  'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Register routes BEFORE app.listen()
app.use('/api', ocrRouter);

app.get('/', (req, res) => {
    res.json({ status: 'ok', port: PORT });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});