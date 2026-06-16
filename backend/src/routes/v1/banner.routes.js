import { Router } from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../../controllers/v1/banner.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import upload from '../../middlewares/upload.middleware.js';

const router = Router();

router.get('/', getActiveBanners);

router.use(protect, authorize('admin'));

router.get('/admin', getAllBanners);
router.post('/', upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), createBanner);
router.put('/:id', upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
