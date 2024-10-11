import express from 'express';
import {
  followUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  updateUser,
} from '../controllers/userController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.route('/profile/:username').get(protectRoute, getUserProfile);
router.route('/suggested').get(protectRoute, getSuggestedUser);
router.route('/follow/:id').post(protectRoute, followUnfollowUser);
router.route('/update').post(updateUser);

export default router;
