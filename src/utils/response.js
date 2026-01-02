export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((error) => next(error, { cause: 500 }));
  };
};

export const globalErrorHandling = (err, req, res, next) => {
  return res.status(err.cause || 500).json({
    message: "error",
    status: err.cause || 500,
    error: err.message,
    stack: err.stack,
  });
};

export const successResponse = ({ res, status, data, message = "success" }) => {
  return res.status(status).json({
    message,
    status,
    data,
  });
};
