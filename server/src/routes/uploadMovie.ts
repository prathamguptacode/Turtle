import express from 'express';
import {
    uploadMovieAbout,
    uploadMovieTrailer,
    uploadMovieVideo,
    uploadPoster,
} from '../controller/uploadMovie.js';
import upload from '../middleware/multerUpload.js';
import {
    fileValidation,
    videoValidation,
} from '../middleware/fileValidation.js';
import { userInfo } from '../middleware/userInfo.js';
const router = express.Router();

router.post('/uploadMovieAbout', userInfo, uploadMovieAbout);
router.post(
    '/uploadPoster',
    userInfo,
    upload.single('file'),
    fileValidation,
    uploadPoster,
);
router.post(
    '/uploadMovie',
    userInfo,
    upload.single('file'),
    videoValidation,
    uploadMovieVideo,
);
router.post(
    '/uploadTrailer',
    userInfo,
    upload.single('file'),
    videoValidation,
    uploadMovieTrailer,
);

export default router;
