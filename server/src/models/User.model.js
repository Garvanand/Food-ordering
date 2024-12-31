// server/src/models/User.model.js
import mongoose from 'mongoose';

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
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'admin'],
    default: 'customer'
  },
  address: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  phone: {
    type: String,
    required: true
  },
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  preferences: {
    vegetarian: Boolean,
    allergies: [String],
    favoriteItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    }]
  }
}, { timestamps: true });






export const User = mongoose.model('User', userSchema);
