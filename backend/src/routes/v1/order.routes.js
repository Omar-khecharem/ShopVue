import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../../controllers/v1/order.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
} from '../../validators/order.validator.js';

const router = Router();

router.use(protect);

router.get('/', getAllOrders);
router.get('/:id', validate(orderIdSchema), getOrderById);
router.post('/', validate(createOrderSchema), createOrder);
router.put('/:id/status', validate(updateOrderStatusSchema), authorize('admin'), updateOrderStatus);

export default router;
