import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Notification from '../models/notificationModel.js';
import {
  comparePasswords,
  hashedPassword,
} from '../utils/passwordEncrypted.js';

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

  // Check if password is there and update them
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

  // Profile and Cover Image Handling
  // Update Profile Image
  if (profileImg) {
    if (user.profileImgFileId) {
      await req.imageKit.deleteFile(user.profileImgFileId);
    }

    const uploadedResponse = await req.imageKit.upload({
      file: profileImg,
      fileName: `profile_img_${userId}`,
    });

    profileImg = uploadedResponse.url;
    const profileImgFileId = uploadedResponse.fileId;
    user.profileImgFileId = profileImgFileId;
  }

  // Update Cover Image
  if (coverImg) {
    if (user.coverImgFileId) {
      await req.imageKit.deleteFile(user.coverImgFileId);
    }

    const uploadedCoverResponse = await req.imageKit.upload({
      file: coverImg,
      fileName: `cover_img_${userId}`,
    });

    coverImg = uploadedCoverResponse.url;
    const coverImgFileId = uploadedCoverResponse.fileId;
    user.coverImgFileId = coverImgFileId;
  }

  // Update other fields
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio !== undefined ? bio : user.bio;
  user.link = link !== undefined ? link : user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;

  // Save updated user details
  user = await user.save();

  // Remove password from response
  user.password = null;

  // Send success response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Delete User Profile
export const deleteUserProfile = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return next(
      new AppError(
        'You have to be login to delete user profile.',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  // Soft Delete
  await User.delete({ _id: userId });

  // Send success response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: null,
  });
});
