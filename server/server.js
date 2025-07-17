import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log("mongoose =", mongoose);

// DB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB connection failed:", err));

app.get('/', (req, res) => res.send('API Running...'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
