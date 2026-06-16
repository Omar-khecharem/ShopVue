const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body[field];

        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push({ field, message: rules.message || `${field} is required` });
          continue;
        }

        if (value === undefined || value === null || value === '') continue;

        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push({ field, message: `${field} must be a string` });
        }

        if (rules.type === 'number') {
          const num = Number(value);
          if (isNaN(num)) {
            errors.push({ field, message: `${field} must be a number` });
            continue;
          }
          if (rules.min !== undefined && num < rules.min) {
            errors.push({ field, message: `${field} must be at least ${rules.min}` });
          }
          if (rules.max !== undefined && num > rules.max) {
            errors.push({ field, message: `${field} must be at most ${rules.max}` });
          }
        }

        if (rules.type === 'mongoId') {
          if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            errors.push({ field, message: `${field} must be a valid ID` });
          }
        }

        if (rules.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({ field, message: 'Invalid email format' });
          }
        }

        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
          errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
        }

        if (rules.enum && !rules.enum.includes(value)) {
          errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
        }
      }
    }

    if (schema.params) {
      for (const [field, rules] of Object.entries(schema.params)) {
        const value = req.params[field];
        if (rules.type === 'mongoId' && !/^[0-9a-fA-F]{24}$/.test(value)) {
          errors.push({ field, message: `Invalid ${field}` });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

export default validate;
