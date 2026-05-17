import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import Routers
import candidateRoutes from './routes/candidateRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Configure dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'AI Candidate Shortlisting API is running...' 
  });
});

// Catch-all route handler for 404s
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shortlisting_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🔌 Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Server successfully launched on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Mongoose database connection failed:', error.message);
    console.log('ℹ️ Make sure MongoDB server is active, or configure a valid MONGO_URI in .env');
    process.exit(1);
  });
