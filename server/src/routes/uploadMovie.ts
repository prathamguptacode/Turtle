import express from 'express';
import { uploadMovieAbout } from '../controller/uploadMovie.js';
import upload from '../middleware/multerUpload.js';
import { fileValidation } from '../middleware/fileValidation.js';
import { userInfo } from '../middleware/userInfo.js';
const router = express.Router();

router.post('/uploadMovieAbout',userInfo,uploadMovieAbout);

export default router;
