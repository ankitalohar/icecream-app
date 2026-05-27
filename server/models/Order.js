import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  },
  { _id: false },
)

const timelineSchema = new mongoose.Schema(
  { status: String, at: { type: Date, default: Date.now } },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: String,
    deliveryAddress: { type: String, required: true },
    items: [orderItemSchema],
    subtotal: Number,
    tax: Number,
    deliveryCharge: Number,
    total: Number,
    status: {
      type: String,
      enum: ['Order Placed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    timeline: [timelineSchema],
    estimatedDeliveryAt: Date,
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)
