import AppError from '../utils/AppError.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join(', '), 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    error = new AppError(`Duplicate value for ${field}`, 409);
  }

  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError('File too large. Maximum size is 5MB.', 400);
    }
    error = new AppError(err.message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
