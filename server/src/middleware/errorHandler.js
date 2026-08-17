export const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || 'unavailable';
  const loggedStatusCode = (err.statusCode || res.statusCode || 500) === 200
    ? 500
    : (err.statusCode || res.statusCode || 500);
  console.error(JSON.stringify({
    type: 'api_error',
    requestId,
    method: req.method,
    statusCode: loggedStatusCode,
    category: err.code || err.name || 'Error'
  }));

  // Never allow a transient failure response to enter the browser or edge cache.
  res.set('Cache-Control', 'no-store');

  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200) statusCode = 500;

  let message = err.message || 'Internal Server Error';
  let code = err.code || 'REQUEST_FAILED';

  // Handle Mongoose duplicate key error (e.g. unique slug or duplicate reference)
  if (err.code === 11000) {
    statusCode = 400;
    code = 'DUPLICATE_VALUE';
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value entered for ${field || 'a unique field'}.`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404;
    code = 'RESOURCE_NOT_FOUND';
    message = `Resource not found with specified identifier.`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_FAILED';
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
  }

  if (statusCode >= 500) {
    message = 'The service is temporarily unavailable. Please try again shortly.';
    code = 'INTERNAL_SERVER_ERROR';
  }

  res.locals.errorCategory = code.toLowerCase();
  res.status(statusCode).json({
    success: false,
    code,
    message,
    requestId
  });
};
