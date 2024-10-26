import app from './app.js';
import { connectMongoDB } from './mongoDB/connectDB.js';

const DB = process.env.MONGODB_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Start server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectMongoDB(DB);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();
