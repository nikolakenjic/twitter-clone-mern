import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Notification from '../models/notificationModel.js';
import {
  comparePasswords,
  hashedPassword,
} from '../utils/passwordEncrypted.js';
import ImageKit from 'imagekit';

export const getUserProfile = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select('-password');

  if (!user) {
    return next(new AppError('User not Found', StatusCodes.BAD_REQUEST));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    user,
  });
});

export const getSuggestedUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  //    Retrieve the list of users the current user is following
  const usersFollowedByMe = await User.findById(userId).select('following');

  //   Find all users who are not equal my current userId and select 10 of them
  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId },
      },
    },
    {
      $sample: { size: 10 },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);

  // Find All users who are not followed by me
  const filteredUsers = users.filter(
    (user) => !usersFollowedByMe.following.includes(user._id)
  );

  //   select 4 suggested user and prevent password to showing up
  const suggestedUsers = filteredUsers.slice(0, 4);

  res.status(StatusCodes.OK).json({
    status: 'success',
    suggestedUsers,
  });
});

export const followUnfollowUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const followedUser = await User.findById(id);
  const currentUser = await User.findById(req.user._id);

  if (id === req.user._id.toString()) {
    return next(
      new AppError(
        'You can not follow/unfollow yourself',
        StatusCodes.BAD_REQUEST
      )
    );
  }

  if (!followedUser || !currentUser) {
    return next(new AppError('User not found', StatusCodes.BAD_REQUEST));
  }

  //  Follow, Unfollow User
  const isFollowing = currentUser.following.includes(id);

  if (isFollowing) {
    // Unfollow the user
    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

    res
      .status(StatusCodes.OK)
      .json({ status: 'success', message: 'User unfollowed successfully' });
  } else {
    // Follow the user
    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

    // Send notification to the user
    const newNotification = new Notification({
      type: 'follow',
      from: req.user._id,
      to: followedUser._id,
    });
    await newNotification.save();

    res
      .status(StatusCodes.OK)
      .json({ status: 'success', message: 'User follow successfully' });
  }
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  // Find User
  let user = await User.findById(userId).select('+password');

  if (!user) {
    return next(new AppError('User Not Found', StatusCodes.NOT_FOUND));
  }

  // Check if password is there and finally update them
  if (!newPassword && currentPassword) {
    return next(
      new AppError(
        'Please provide both current password and new password',
        StatusCodes.BAD_REQUEST
      )
    );
  }

  if (currentPassword && newPassword) {
    const isMatch = await comparePasswords(currentPassword, user.password);
    if (!isMatch) {
      return next(
        new AppError('Current password is incorrect', StatusCodes.BAD_REQUEST)
      );
    }

    user.password = await hashedPassword(newPassword);
  }

  const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  // Profile and Cover img

  // console.log('userImg', user.profileImg.split('/').pop().split('.')[0]);
  if (profileImg) {
    if (user.profileImg) {
      await imageKit.deleteFile(user.profileImg.split('/').pop().split('.')[0]);
    }

    const uploadedResponse = await imageKit.upload({
      file: profileImg,
      fileName: `profile_img_${userId}`, // Updated fileName to ensure uniqueness
    });
    profileImg = uploadedResponse.url;
  }

  if (coverImg) {
    // Add logic for coverImg if needed
    if (user.coverImg) {
      await imageKit.deleteFile(user.coverImg.split('/').pop().split('.')[0]);
    }

    const uploadedCoverResponse = await imageKit.upload({
      file: coverImg,
      fileName: `cover_img_${userId}`, // Updated fileName to ensure uniqueness
    });
    coverImg = uploadedCoverResponse.url;
  }

  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;

  user = await user.save();

  // password should be null in response
  user.password = null;

  // Send response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user,
    },
  });
});
