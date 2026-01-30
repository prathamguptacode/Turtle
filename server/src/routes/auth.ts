import express from 'express';
import { login, signup, verify } from '../controller/auth.js';
const router = express.Router();

router.post('/signup',signup)
router.post('/verify',verify)
router.post('/login',login)

export default router