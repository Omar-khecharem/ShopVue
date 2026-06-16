import { Router } from 'express';
import {
  getPublicSections,
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from '../../controllers/v1/homepage.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = Router();

router.get('/', getPublicSections);

router.use(protect, authorize('admin'));

router.get('/admin', getAllSections);
router.post('/', createSection);
router.put('/reorder', reorderSections);
router.put('/:id', updateSection);
router.delete('/:id', deleteSection);

export default router;
