import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
  comparePasswords,
  hashedPassword,
} from '../utils/passwordEncrypted.js';
import AppError from '../utils/appError.js';

export const signUp = catchAsync(async (req, res, next) => {
  const { fullName, username, email, password } = req.body;

  const hashPwd = await hashedPassword(password);

  const newUser = new User({
    fullName,
    username,
    email,
    password: hashPwd,
  });

  // Create Token, send cookie and save user to DB
  generateTokenAndSetCookie({ userId: newUser._id }, res);
  await newUser.save();

  if (process.env.NODE_ENV === 'production') {
    newUser.password = undefined;
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        'Please provide correct email and password',
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const user = await User.findOne({ email }).select('+password');

  const isValidUser = user && (await comparePasswords(password, user.password));

  if (!isValidUser) {
    return next(
      new AppError('Email or password is incorrect', StatusCodes.UNAUTHORIZED)
    );
  }

  generateTokenAndSetCookie({ userId: user._id }, res);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });

  res.status(StatusCodes.OK).json({
    status: 'successfully logout',
    data: null,
  });
});

export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: user,
  });
});
