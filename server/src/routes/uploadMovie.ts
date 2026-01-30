import express from 'express';
import { uploadMovieAbout } from '../controller/uploadMovie.js';
import upload from '../middleware/multerUpload.js';
import { fileValidation } from '../middleware/fileValidation.js';
const router = express.Router();

router.post('/uploadMovie', upload.single('file'), fileValidation ,uploadMovieAbout);

export default router;
