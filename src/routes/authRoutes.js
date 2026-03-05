import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Define routes as per technical requirements
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;