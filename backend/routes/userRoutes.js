import express from 'express';
import {
  deleteUserProfile,
  followUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  updateUser,
} from '../controllers/userController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.use(protectRoute);

router.route('/profile/:username').get(getUserProfile);
router.route('/suggested').get(getSuggestedUser);
router.route('/follow/:id').post(followUnfollowUser);
router.route('/update').post(updateUser);
router.route('/delete').delete(deleteUserProfile);

export default router;
