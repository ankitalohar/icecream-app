import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    image: { type: String, required: true },
    tag: String,
    category: { type: String, default: 'ice-cream' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
