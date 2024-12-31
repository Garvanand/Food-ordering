// server/src/models/Restaurant.model.js
const restaurantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    contactInfo: {
      phone: String,
      email: String
    },
    operatingHours: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      open: String,
      close: String
    }],
    cuisine: [String],
    rating: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },
    menu: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    }],
    owners: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    settings: {
      autoAcceptOrders: Boolean,
      preparationTimeBuffer: Number,
      maxOrdersPerHour: Number
    }
  }, { timestamps: true });

  export const Restaurant = mongoose.model('Restaurant', restaurantSchema);