import { Router } from 'express';
import authRoutes from './v1/auth.routes.js';
import userRoutes from './v1/user.routes.js';
import productRoutes from './v1/product.routes.js';
import orderRoutes from './v1/order.routes.js';
import categoryRoutes from './v1/category.routes.js';
import homepageRoutes from './v1/homepage.routes.js';
import bannerRoutes from './v1/banner.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/homepage', homepageRoutes);
router.use('/banners', bannerRoutes);

export default router;
