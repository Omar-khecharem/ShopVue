import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../controllers/v1/product.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import upload from '../../middlewares/upload.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from '../../validators/product.validator.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', validate(productIdSchema), getProductById);

router.use(protect, authorize('admin'));

router.post('/', upload.array('images', 5), validate(createProductSchema), createProduct);
router.put('/:id', validate(productIdSchema), upload.array('images', 5), validate(updateProductSchema), updateProduct);
router.delete('/:id', validate(productIdSchema), deleteProduct);

export default router;
