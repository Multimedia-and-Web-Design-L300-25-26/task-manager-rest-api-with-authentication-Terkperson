import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  }
});

// Hash password before storing
// REMOVED 'next' - Modern Mongoose async hooks don't need it
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    // Hashing with a cost factor of 10
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    // Throwing error allows Mongoose to catch it and stop the save
    throw error;
  }
});

// Helper method to validate password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);