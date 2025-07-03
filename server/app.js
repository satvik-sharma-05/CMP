import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import managerRoutes from './routes/managers.js';
import Manager from './models/Manager.js'; // ✅ ensure Manager model is imported

// Route imports
import authRoutes from './routes/auth.js';
import colleagueRoutes from './routes/colleagues.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/colleagues', colleagueRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/managers', managerRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;