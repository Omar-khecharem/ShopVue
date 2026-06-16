import Banner from '../../models/Banner.js';

export const getActiveBanners = async (req, res, next) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      enabled: true,
      $and: [
        { $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] },
        { $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }] },
      ],
    }).sort({ order: 1 }).lean();
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
};

export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1 }).lean();
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const max = await Banner.findOne().sort({ order: -1 }).select('order').lean();
    const banner = await Banner.create({ ...req.body, order: (max?.order ?? -1) + 1 });
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    next(err);
  }
};
