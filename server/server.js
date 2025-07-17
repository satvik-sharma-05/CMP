// --- Setup ---
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import colleagueRoutes from './routes/colleagues.js';
import managerRoutes from './routes/managers.js';
// --- Setup ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define allowed origins before using
const allowedOrigins = ['https://frontend-a0mq.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));




// ✅ ✅ Register API Routes first!
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/colleagues', colleagueRoutes);
app.use('/api/managers', managerRoutes);


app.options('*', cors()); // Handle preflight



// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB connection failed:", err));

// ✅ Serve frontend after APIs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');

app.use(express.static(clientBuildPath));

// ✅ Catch-all route (only for frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
