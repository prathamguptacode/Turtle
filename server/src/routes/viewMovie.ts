import express from 'express';
import { poster, search, trailer, video } from '../controller/viewMovie.js';
const router = express.Router();

router.post('/poster', poster);
router.post('/trailer', trailer);
router.post('/video', video);
router.post('/search', search)

export default router;
