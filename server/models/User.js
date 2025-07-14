import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  leaveBalance: {
    vacation: { type: Number, default: 12 },
    sick: { type: Number, default: 8 },
    other: {type: Number, default: 5}
  },
  manager: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
