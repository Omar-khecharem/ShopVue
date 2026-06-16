export const createOrderSchema = {
  body: {
    'products': { required: true, type: 'array', message: 'Products are required' },
    'shippingAddress.street': { required: true, type: 'string' },
    'shippingAddress.city': { required: true, type: 'string' },
    'shippingAddress.country': { required: true, type: 'string' },
  },
};

export const updateOrderStatusSchema = {
  body: {
    status: { required: true, type: 'string', enum: ['pending', 'shipped', 'delivered'], message: 'Status must be pending, shipped, or delivered' },
  },
  params: {
    id: { type: 'mongoId' },
  },
};

export const orderIdSchema = {
  params: {
    id: { type: 'mongoId' },
  },
};
