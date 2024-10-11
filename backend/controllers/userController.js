import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Notification from '../models/notificationModel.js';

export const getUserProfile = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select('-password');

  if (!user) {
    return next(new AppError('User not Found', StatusCodes.BAD_REQUEST));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user,
    },
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
  ]);

  // Find All users who are not followed by me
  const filteredUsers = users.filter(
    (user) => !usersFollowedByMe.following.includes(user._id)
  );

  //   select 4 suggested user and prevent password to showing up
  const suggestedUsers = filteredUsers.slice(0, 4);

  // Exclude password
  suggestedUsers.forEach((user) => (user.password = undefined));

  console.log(suggestedUsers);

  res.send('suggested');
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

export const updateUser = (req, res, next) => {
  res.send('updateUser');
};
