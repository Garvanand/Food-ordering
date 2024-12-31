// server/src/controllers/order.controller.js
import { Order } from '../models/Order.model.js';
import { Restaurant } from '../models/Restaurant.model.js';
import { MenuItem } from '../models/MenuItem.model.js';
import { initializeCashfree, createOrder as createCashfreeOrder } from '../services/payment.service.js';

export const orderController = {
  async createOrder(req, res) {
    try {
      const {
        restaurantId,
        items,
        deliveryAddress,
        paymentMethod
      } = req.body;

      // Validate restaurant
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Calculate total and verify items
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem || !menuItem.inStock) {
          return res.status(400).json({ 
            message: `Item ${menuItem ? menuItem.name : item.menuItemId} is not available` 
          });
        }

        orderItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          price: menuItem.price,
          specialInstructions: item.specialInstructions
        });

        totalAmount += menuItem.price * item.quantity;
      }

      // Set order acceptance timeout (30 minutes)
      const orderAcceptanceTimeout = new Date();
      orderAcceptanceTimeout.setMinutes(orderAcceptanceTimeout.getMinutes() + 30);

      // Create order
      const order = new Order({
        customer: req.user.id,
        restaurant: restaurantId,
        items: orderItems,
        totalAmount,
        deliveryAddress,
        paymentMethod,
        orderAcceptanceTimeout
      });

      await order.save();

      // If payment method is online, create payment order
      if (paymentMethod === 'online') {
        const cashfree = initializeCashfree();
        const paymentOrder = await createCashfreeOrder(cashfree, {
          orderId: order._id.toString(),
          amount: totalAmount,
          currency: "INR",
          customerDetails: {
            customerId: req.user.id,
            customerEmail: req.user.email,
            customerPhone: req.user.phone
          }
        });

        return res.status(201).json({
          order,
          paymentOrder
        });
      }

      res.status(201).json({ order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Verify restaurant authorization
      const restaurant = await Restaurant.findOne({ owners: req.user.id });
      if (!restaurant || order.restaurant.toString() !== restaurant._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Validate status transition
      const validTransitions = {
        pending: ['accepted', 'cancelled'],
        accepted: ['preparing'],
        preparing: ['ready'],
        ready: ['out_for_delivery'],
        out_for_delivery: ['delivered']
      };

      if (!validTransitions[order.status]?.includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status transition' 
        });
      }

      order.status = status;
      if (status === 'delivered') {
        order.actualDeliveryTime = new Date();
      }

      await order.save();

      // Emit socket event for real-time updates
      req.io.to(`order_${orderId}`).emit('order_updated', order);

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getOrderDetails(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId)
        .populate('items.menuItem')
        .populate('restaurant', 'name address contactInfo');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Verify authorization
      if (order.customer.toString() !== req.user.id && 
          !await Restaurant.exists({ owners: req.user.id, _id: order.restaurant })) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getOrderHistory(req, res) {
    try {
      const { role } = req.user;
      let query = {};

      if (role === 'customer') {
        query.customer = req.user.id;
      } else if (role === 'restaurant') {
        const restaurant = await Restaurant.findOne({ owners: req.user.id });
        if (!restaurant) {
          return res.status(404).json({ message: 'Restaurant not found' });
        }
        query.restaurant = restaurant._id;
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .populate('items.menuItem', 'name price')
        .populate('restaurant', 'name');

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// server/src/services/payment.service.js
import Cashfree from 'cashfree-sdk';

export const initializeCashfree = () => {
  return new Cashfree({
    apiKey: process.env.CASHFREE_API_KEY,
    apiSecret: process.env.CASHFREE_API_SECRET,
    env: process.env.NODE_ENV === 'production' ? 'PROD' : 'TEST'
  });
};

export const createOrder = async (cashfree, orderData) => {
  try {
    const response = await cashfree.orders.create(orderData);
    return response;
  } catch (error) {
    throw new Error(`Payment gateway error: ${error.message}`);
  }
};

export const verifyPayment = async (cashfree, orderId, orderToken) => {
  try {
    const response = await cashfree.orders.verify({
      orderId,
      orderToken
    });
    return response;
  } catch (error) {
    throw new Error(`Payment verification error: ${error.message}`);
  }
};

