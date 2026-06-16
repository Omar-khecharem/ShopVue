export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new Error(
        `Role ${req.user.role} is not authorized to access this route`
      );
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};
