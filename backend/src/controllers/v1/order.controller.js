import * as orderService from '../../services/order.service.js';

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAll(req.user._id, req.user.role);
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.create(req.user._id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
