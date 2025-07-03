import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const managerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
    email: {
    type: String,
    required: true,
    unique: true,        // This is what triggered the duplicate key error
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager'],
    default: 'Manager'
  }
}, { timestamps: true });

managerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

managerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Manager || mongoose.model("Manager", managerSchema);
