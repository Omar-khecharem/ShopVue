export const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProductSchema = {
  body: {
    name: { required: true, type: 'string', minLength: 2, message: 'Product name is required' },
    description: { required: true, type: 'string', minLength: 10, message: 'Description must be at least 10 characters' },
    price: { required: true, type: 'number', min: 0.01, message: 'Price must be greater than 0' },
    stock: { required: true, type: 'number', min: 0, message: 'Stock cannot be negative' },
    category: { required: true, type: 'mongoId', message: 'Valid category ID is required' },
  },
};

export const updateProductSchema = {
  body: {
    name: { type: 'string', minLength: 2 },
    description: { type: 'string', minLength: 10 },
    price: { type: 'number', min: 0.01 },
    stock: { type: 'number', min: 0 },
    category: { type: 'mongoId' },
  },
};

export const productIdSchema = {
  params: {
    id: { type: 'mongoId' },
  },
};
