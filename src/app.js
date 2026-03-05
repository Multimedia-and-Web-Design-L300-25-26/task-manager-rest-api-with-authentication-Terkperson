import dotenv from 'dotenv';
// 1. Initialize dotenv BEFORE anything else
const envResult = dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Debug log to help you see what's happening in the terminal
if (envResult.error) {
  console.error(" ERROR: Could not find .env file. Check if it's named .env.txt by mistake.");
} else {
  console.log(" .env variables loaded.");
}

const app = express();

// Middleware
app.use(express.json());

// 2. Use a fallback string to prevent the "must be a string" error if env fails
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error(" ERROR: MONGO_URI is undefined. Check your .env file content.");
} else {
  mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// 3. Only start the server if this file is run directly (prevents test conflicts)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;