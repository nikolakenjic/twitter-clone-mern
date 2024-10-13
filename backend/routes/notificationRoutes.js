import express from 'express';
import {
  deleteNotifications,
  getNotifications,
} from '../controllers/notificationController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.route('/').get(protectRoute, getNotifications);

router.route('/').delete(protectRoute, deleteNotifications);

export default router;
