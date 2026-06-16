import HomepageSection from '../../models/HomepageSection.js';
import Product from '../../models/Product.js';

export const getPublicSections = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find({ enabled: true }).sort({ order: 1 }).lean();

    const enriched = await Promise.all(
      sections.map(async (section) => {
        if (['featured', 'best_sellers', 'trending', 'product_grid'].includes(section.type)) {
          const ids = section.content?.productIds || [];
          if (ids.length > 0) {
            const products = await Product.find({ _id: { $in: ids } }).populate('category', 'name').lean();
            return { ...section, content: { ...section.content, products } };
          }
          const sort = section.type === 'featured' ? '-createdAt' : section.type === 'best_sellers' ? '-stock' : '-createdAt';
          const limit = section.content?.limit || 4;
          const products = await Product.find().sort(sort).limit(limit).populate('category', 'name').lean();
          return { ...section, content: { ...section.content, products } };
        }
        if (section.type === 'category_showcase') {
          const ids = section.content?.categoryIds || [];
          if (ids.length > 0) {
            const { default: Category } = await import('../../models/Category.js');
            const cats = await Category.find({ _id: { $in: ids } }).lean();
            return { ...section, content: { ...section.content, categories: cats } };
          }
        }
        return section;
      })
    );

    res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

export const getAllSections = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find().sort({ order: 1 }).lean();
    res.status(200).json({ success: true, data: sections });
  } catch (err) {
    next(err);
  }
};

export const createSection = async (req, res, next) => {
  try {
    const max = await HomepageSection.findOne().sort({ order: -1 }).select('order').lean();
    const section = await HomepageSection.create({ ...req.body, order: (max?.order ?? -1) + 1 });
    res.status(201).json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const section = await HomepageSection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const section = await HomepageSection.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, message: 'Section deleted' });
  } catch (err) {
    next(err);
  }
};

export const reorderSections = async (req, res, next) => {
  try {
    const { orderMap } = req.body;
    await Promise.all(
      Object.entries(orderMap).map(([id, order]) =>
        HomepageSection.findByIdAndUpdate(id, { order })
      )
    );
    res.status(200).json({ success: true, message: 'Reordered' });
  } catch (err) {
    next(err);
  }
};
