import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  desktopImage: { type: String, default: '' },
  mobileImage: { type: String, default: '' },
  link: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  publishedAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

bannerSchema.index({ order: 1 });
bannerSchema.index({ enabled: 1, publishedAt: 1, expiresAt: 1 });

export default mongoose.model('Banner', bannerSchema);
