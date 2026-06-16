import * as productService from '../../services/product.service.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const { products, pagination } = await productService.getAll(req.query);
    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.create(req.body, req.files);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body, req.files);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
