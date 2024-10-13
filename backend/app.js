import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.js';
import { errorGlobal } from './controllers/errorController.js';

// Import Routes
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';

const app = express();

// Get the current directory from the import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __config = path.dirname(__filename);
// Use path.resolve to construct the path to the .env file
dotenv.config({ path: path.resolve(__config, './../.env') });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // to parse req.body
// app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

// Cookie Parser
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/notifications', notificationRouter);

console.log('PROCESS_ENV:', process.env.NODE_ENV);

app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(errorGlobal);

export default app;
