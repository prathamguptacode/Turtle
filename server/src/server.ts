import 'dotenv/config';
import express from 'express';
import { env } from './config/enviromentType.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import welcome from './routes/welcome.js';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import auth from './routes/auth.js';
import upload from './routes/uploadMovie.js';
import chat from './routes/chatbox.js';
import algo from './routes/algo.js';
import view from './routes/viewMovie.js'

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(cookieParser());
mongoose.connect(env.DB_URL).then(() => console.log('Connected to DATABASE'));

app.use('/api', welcome);
app.use('/api', auth);
app.use('/api', upload);
app.use('/api', chat);
app.use('/api', algo);
app.use('/api', view);

const port = env.PORT;
app.use(errorHandler);
app.listen(port, () => console.log(`Server on port ${port}`));
