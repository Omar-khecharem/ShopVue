export const registerSchema = {
  body: {
    name: { required: true, type: 'string', minLength: 2, message: 'Name is required (min 2 characters)' },
    email: { required: true, type: 'email', message: 'Valid email is required' },
    password: { required: true, type: 'string', minLength: 6, message: 'Password must be at least 6 characters' },
  },
};

export const loginSchema = {
  body: {
    email: { required: true, type: 'email', message: 'Valid email is required' },
    password: { required: true, type: 'string', message: 'Password is required' },
  },
};

export const updateProfileSchema = {
  body: {
    name: { type: 'string', minLength: 2 },
    email: { type: 'email' },
  },
};
