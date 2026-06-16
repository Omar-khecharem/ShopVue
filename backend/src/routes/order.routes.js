import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
