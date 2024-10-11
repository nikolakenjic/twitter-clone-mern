import mongoose from 'mongoose';

export const connectMongoDB = async (mongoDB) => {
  console.log('Connecting to DB...');
  try {
    const connect = await mongoose.connect(mongoDB);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
