export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err);

  // Never allow a transient failure response to enter the browser or edge cache.
  res.set('Cache-Control', 'no-store');

  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200) statusCode = 500;

  let message = err.message || 'Internal Server Error';

  // Handle Mongoose duplicate key error (e.g. unique slug or duplicate reference)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value entered for ${field || 'a unique field'}.`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with specified identifier.`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
