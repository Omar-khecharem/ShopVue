import mongoose from 'mongoose';

const homepageSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'hero', 'featured', 'best_sellers', 'social_proof',
      'testimonials', 'benefits', 'trending', 'faq',
      'newsletter', 'promo_block', 'brands', 'category_showcase',
      'custom_html', 'product_grid', 'banner_carousel',
    ],
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

homepageSectionSchema.index({ order: 1 });

export default mongoose.model('HomepageSection', homepageSectionSchema);
