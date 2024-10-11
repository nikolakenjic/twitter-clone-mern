import { StatusCodes } from 'http-status-codes';

const sendErrorDev = (err, res) => {
  console.log('Dev Err 💥', err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // console.log('prod Err 💥', err);
  console.log('prod Err 💥', JSON.stringify(err, null, 2));

  // Handle MongoDB duplicate key error (e.g., duplicate username)
  if (err.code === 11000) {
    const message =
      'Username or email already exists. Please use a different one!';
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message,
    });
  }
  // Handle Mongoose validation error
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    const errorMessage = `Invalid input data: ${messages.join('. ')}`;
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: errorMessage,
    });
  }
  // Operational Error
  else if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or unknown error
  else {
    // Log the error
    console.error('Error 💥', err);
    // Send a generic message
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export const errorGlobal = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // DEVELOPMENT OR PRODUCTION
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
