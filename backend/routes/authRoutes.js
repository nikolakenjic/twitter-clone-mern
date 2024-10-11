import express from 'express';
import { getMe, login, logout, signUp } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.route('/me').get(protectRoute, getMe);

router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/logout').get(logout);

export default router;
