import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    description: String,
    image: String,
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 });

export default mongoose.model('Category', categorySchema);
