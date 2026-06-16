import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.use(protect);
router.use(authorize('admin'));

router.post('/', upload.array('images', 5), createProduct);
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
