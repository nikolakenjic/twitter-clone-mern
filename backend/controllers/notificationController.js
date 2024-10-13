import { StatusCodes } from 'http-status-codes';
import Notification from '../models/notificationModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ to: userId }).populate({
    path: 'from',
    select: 'username profileImg',
  });

  await Notification.updateMany({ to: userId }, { read: true });

  res.status(StatusCodes.OK).json({ status: 'success', notifications });
});

export const deleteNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  await Notification.deleteMany({ to: userId });

  res
    .status(StatusCodes.OK)
    .json({ status: 'success', message: 'Notifications deleted successfully' });
});
