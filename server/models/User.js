import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  { label: { type: String, default: 'Home' }, address: { type: String, required: true, trim: true } },
  { _id: true },
)

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: {
      type: String,
      required() {
        return this.role === 'user'
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    address: {
      type: String,
      required() {
        return this.role === 'user'
      },
      trim: true,
      maxlength: 300,
      default: '',
    },
    addresses: [addressSchema],
    profilePhoto: { type: String, default: '' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
)

export default mongoose.model('User', userSchema)
