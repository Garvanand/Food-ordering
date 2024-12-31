// server/src/routes/menu.routes.js
import express from 'express';
import { menuController } from '../controllers/menu.controller.js';
import { auth, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, authorize('restaurant'), menuController.addMenuItem);
router.put('/:id', auth, authorize('restaurant'), menuController.updateMenuItem);
router.get('/restaurant/:restaurantId', menuController.getMenuItems);
router.patch('/:id/stock', auth, authorize('restaurant'), menuController.updateStock);

export default router;