// server/src/models/Order.model.js
const orderSchema = new mongoose.Schema({
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    items: [{
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      specialInstructions: String
    }],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      required: true
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    orderAcceptanceTimeout: {
      type: Date,
      required: true
    }
  }, { timestamps: true });
  export const Order = mongoose.model('Order', orderSchema);
  