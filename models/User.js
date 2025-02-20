import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  currency: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
