import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';

export const getAll = async (userId, role) => {
  const filter = role === 'admin' ? {} : { user: userId };
  const orders = await Order.find(filter)
    .populate('products.product', 'name price images')
    .populate('user', 'name email')
    .sort('-createdAt')
    .lean();
  return orders;
};

export const getById = async (id, userId, role) => {
  const order = await Order.findById(id)
    .populate('products.product', 'name price images')
    .populate('user', 'name email');

  if (!order) throw new AppError('Order not found', 404);

  if (role !== 'admin' && order.user._id.toString() !== userId.toString()) {
    throw new AppError('Not authorized to view this order', 403);
  }

  return order;
};

export const create = async (userId, { products, shippingAddress }) => {
  if (!products || products.length === 0) {
    throw new AppError('At least one product is required', 400);
  }

  const productIds = products.map((p) => p.product);
  const found = await Product.find({ _id: { $in: productIds } }).select(
    'name price stock'
  );

  if (found.length !== productIds.length) {
    throw new AppError('One or more products not found', 404);
  }

  const productMap = new Map(found.map((p) => [p._id.toString(), p]));

  const orderProducts = products.map(({ product: id, quantity }) => {
    const productDoc = productMap.get(id);
    if (!productDoc) throw new AppError(`Product ${id} not found`, 404);
    if (productDoc.stock < quantity) {
      throw new AppError(
        `Insufficient stock for ${productDoc.name}. Available: ${productDoc.stock}`,
        400
      );
    }
    return { product: id, quantity, price: productDoc.price };
  });

  const totalPrice = orderProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const order = await Order.create({
    user: userId,
    products: orderProducts,
    totalPrice,
    shippingAddress,
  });

  for (const item of orderProducts) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return order;
};

export const updateStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) throw new AppError('Order not found', 404);
  return order;
};
