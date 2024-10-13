import express from 'express';
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from '../controllers/postController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.route('/all').get(protectRoute, getAllPosts);
router.route('/following').get(getFollowingPosts);
router.route('/likes/:id').get(getLikedPosts);
router.route('/user/:username').get(getUserPosts);

router.route('/create').post(protectRoute, createPost);
router.route('/like/:id').post(likeUnlikePost);
router.route('/comment/:postId').post(protectRoute, commentOnPost);
router.route('/:postId').delete(protectRoute, deletePost);

export default router;
