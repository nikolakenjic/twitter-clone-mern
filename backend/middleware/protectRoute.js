import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protectRoute = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError(
        'You Have to be login for access this route',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return next(
      new AppError(
        'You Have to be login for access this route',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const user = await User.findById(decoded.userId).select('-password');

  req.user = user;

  next();
});
