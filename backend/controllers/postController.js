import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Post from '../models/postModel.js';

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

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
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
    .populate({ path: 'user', select: '-password' }); //this mean show user data in post.user
  // Also have to create user.data on comments but that later

  if (posts.length === 0) {
    return next(new AppError('There are no posts yet', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    posts,
  });
});

export const getFollowingPosts = (req, res, next) => {
  res.send('getFollowingPosts');
};

export const getLikedPosts = (req, res, next) => {
  res.send('getLikedPosts');
};

export const getUserPosts = (req, res, next) => {
  res.send('getUserPosts');
};

export const likeUnlikePost = (req, res, next) => {
  res.send('likeUnlikePost');
};

export const commentOnPost = (req, res, next) => {
  res.send('commentOnPost');
};
