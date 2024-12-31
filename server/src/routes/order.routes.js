// server/src/routes/order.routes.js
import express from 'express';
import { orderController } from '../controllers/order.controller.js';
import { auth, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, authorize('customer'), orderController.createOrder);
router.patch('/:orderId/status', auth, authorize('restaurant'), orderController.updateOrderStatus);
router.get('/:orderId', auth, orderController.getOrderDetails);
router.get('/history', auth, orderController.getOrderHistory);

export default router;