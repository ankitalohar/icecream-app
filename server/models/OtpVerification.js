import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, index: true },
    channel: { type: String, required: true, enum: ['email', 'phone'] },
    purpose: { type: String, required: true, enum: ['login', 'signup', 'forgot-password'] },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
)

export default mongoose.model('OtpVerification', otpSchema)
