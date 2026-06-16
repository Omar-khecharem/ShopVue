import Category from '../../models/Category.js';
import AppError from '../../utils/AppError.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (err) { next(err); }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) throw new AppError('Category not found', 404);
    res.status(200).json({ success: true, data: category });
  } catch (err) { next(err); }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) throw new AppError('Category not found', 404);
    res.status(200).json({ success: true, data: category });
  } catch (err) { next(err); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new AppError('Category not found', 404);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) { next(err); }
};
