// --- Setup ---
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import colleagueRoutes from './routes/colleagues.js';
import managerRoutes from './routes/managers.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS config for frontend origin
const allowedOrigins = ['https://frontend-a0mq.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/colleagues', colleagueRoutes);
app.use('/api/managers', managerRoutes);

// ✅ Optional: Handle preflight globally
app.options('*', cors());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB connection failed:", err));

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
