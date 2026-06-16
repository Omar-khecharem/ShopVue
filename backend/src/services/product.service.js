import Product from '../models/Product.js';
import APIFeatures from '../utils/apiFeatures.js';
import {
  uploadMultipleFromBuffer,
  deleteImage,
} from './cloudinary.service.js';
import AppError from '../utils/AppError.js';

const extractPublicId = (url) => {
  const parts = url.split('/');
  const file = parts.pop();
  return file ? file.split('.')[0] : '';
};

export const getAll = async (queryString) => {
  const features = new APIFeatures(Product.find(), queryString)
    .search(['name', 'description'])
    .filter();

  features.apply().sort().select().paginate();

  const products = await features.query.populate('category', 'name');
  const total = await Product.countDocuments(features.getFilter());

  return {
    products,
    pagination: features.getPaginationMeta(total),
  };
};

export const getById = async (id) => {
  const product = await Product.findById(id).populate('category', 'name');
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const create = async (data, files) => {
  let images = [];
  if (files && files.length > 0) {
    const buffers = files.map((f) => f.buffer);
    images = await uploadMultipleFromBuffer(buffers);
  }
  delete data.images;
  const product = await Product.create({ ...data, images });
  return product;
};

export const update = async (id, data, files) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);

  if (files && files.length > 0) {
    for (const url of product.images) {
      const publicId = extractPublicId(url);
      if (publicId) {
        await deleteImage(`ecommerce/products/${publicId}`).catch(() => {});
      }
    }
    const buffers = files.map((f) => f.buffer);
    data.images = await uploadMultipleFromBuffer(buffers);
  } else {
    delete data.images;
  }

  Object.assign(product, data);
  await product.save();
  return product;
};

export const remove = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);

  for (const url of product.images) {
    const publicId = extractPublicId(url);
    if (publicId) {
      await deleteImage(`ecommerce/products/${publicId}`).catch(() => {});
    }
  }

  await product.deleteOne();
};
