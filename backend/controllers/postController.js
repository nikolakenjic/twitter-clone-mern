import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Post from '../models/postModel.js';
import Notification from '../models/notificationModel.js';

export const createPost = catchAsync(async (req, res, next) => {
  const { text, img } = req.body;
  const userId = req.user._id.toString();

  //   find user ti send user data when create post
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User Not Found', StatusCodes.NOT_FOUND));
  }

  if (!text && !img) {
    return next(
      new AppError('Post must have text or image', StatusCodes.BAD_REQUEST)
    );
  }
  // console.log(process.env.IMAGEKIT_PUBLIC_KEY);

  if (img) {
    // For now just clg
    console.log('You upload image');
  }

  const newPost = new Post({
    user: userId,
    text,
    img,
  });

  await newPost.save();

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id.toString();

  //   Find Post
  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('Post Now Found', StatusCodes.NOT_FOUND));
  }

  //   Check if user has permission to delete post
  if (post.user.toString() !== userId) {
    return next(
      new AppError(
        'You are not authorized to delete this post',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  //   Check if there is Img in AWs or cloudinay (that later)
  if (post.img) {
    console.log('Delete img from img server');
  }

  // Delete Post
  await Post.findByIdAndDelete(postId);
  res
    .status(StatusCodes.OK)
    .json({ status: 'success', message: 'Post deleted successfully' });
});

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: 'user', select: '-password' })
    .populate({
      path: 'comments.user',
      select: '-password',
    });

  if (posts.length === 0) {
    return next(new AppError('There are no posts yet', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    posts,
  });
});

export const commentOnPost = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { postId } = req.params;
  const userId = req.user._id;

  if (!text) {
    return next(
      new AppError('Text field is required', StatusCodes.BAD_REQUEST)
    );
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('Post Now Found', StatusCodes.NOT_FOUND));
  }

  const comment = { user: userId, text };

  post.comments.push(comment);
  await post.save();

  const updateComments = post.comments;

  res.status(StatusCodes.OK).json({
    status: 'success',
    updateComments,
  });
});

export const likeUnlikePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('Post Now Found', StatusCodes.NOT_FOUND));
  }

  const userLikedPost = post.likes.includes(userId);

  if (userLikedPost) {
    // Unlike Post
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

    const updateLikes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    res
      .status(StatusCodes.OK)
      .json({ status: 'success', message: 'Unlike!', updateLikes });
  } else {
    // Like Post
    post.likes.push(userId);
    await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

    await post.save();

    // Send notification to the user
    const newNotification = new Notification({
      type: 'like',
      from: userId,
      to: post.user,
    });
    await newNotification.save();

    const updateLikes = post.likes;
    res
      .status(StatusCodes.OK)
      .json({ status: 'success', message: 'Like!', updateLikes });
  }
});

export const getLikedPosts = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User Now Found', StatusCodes.NOT_FOUND));
  }

  const likedPosts = await Post.find({
    _id: { $in: user.likedPosts },
  })
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments.user',
      select: '-password',
    });

  res.status(StatusCodes.OK).json({ status: 'success', posts: likedPosts });
});

export const getFollowingPosts = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User Now Found', StatusCodes.NOT_FOUND));
  }

  const following = user.following;

  const feedPosts = await Post.find({ user: { $in: following } })
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments.user',
      select: '-password',
    });

  res.status(StatusCodes.OK).json({ status: 'success', posts: feedPosts });
});

export const getUserPosts = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    return next(new AppError('User Now Found', StatusCodes.NOT_FOUND));
  }

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: '-password',
    })
    .populate({
      path: 'comments.user',
      select: '-password',
    });

  res.status(StatusCodes.OK).json({ status: 'success', posts });
});
