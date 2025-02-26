import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://annotation:EPlwRya5HGW4gc8n@cluster0.58knn8l.mongodb.net/annotationDB?retryWrites=true&w=majority&appName=annotation';


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
