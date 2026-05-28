import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 140 },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    timestamp: { type: Date, default: Date.now, index: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

export default mongoose.model('Contact', contactSchema)
