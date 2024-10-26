import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import ImageKit from 'imagekit';

import AppError from './utils/appError.js';
import { errorGlobal } from './controllers/errorController.js';

// Import Routes
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';

// Get the current directory from the import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __config = path.dirname(__filename);
// Use path.resolve to construct the path to the .env file
dotenv.config({ path: path.resolve(__config, './../.env') });

const app = express();

const __dirname = path.resolve();

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '5mb' })); // to parse req.body
// app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

// Cookie Parser
app.use(cookieParser());
// ImageKIT
app.use((req, res, next) => {
  req.imageKit = imageKit;
  next();
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/notifications', notificationRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(errorGlobal);

export default app;
