import express, { type Request, type Response } from 'express';
import { byTag, mayLike, similarMovie, topMovie } from '../controller/algo.js';
import { userInfo } from '../middleware/userInfo.js';
const router = express.Router();

router.get('/topMovie',userInfo,topMovie)
router.post('/similar',similarMovie)
router.get('/maylike',userInfo,mayLike)
router.post('/byTag',byTag)

export default router