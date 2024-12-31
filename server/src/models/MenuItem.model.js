// server/src/models/MenuItem.model.js
const menuItemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true
    },
    image: String,
    inStock: {
      type: Boolean,
      default: true
    },
    preparationTime: {
      type: Number, // in minutes
      required: true
    },
    attributes: {
      isVegetarian: Boolean,
      isVegan: Boolean,
      isGlutenFree: Boolean,
      spicyLevel: {
        type: Number,
        min: 0,
        max: 3
      }
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    }
  }, { timestamps: true });

  export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
