import express from 'express';
import { fileValidation } from '../middleware/fileValidation.js';
import upload from '../middleware/multerUpload.js';
const router = express.Router();

router.post('/test',upload.single('file'),fileValidation,(req,res)=>{
    return res.json({message: 'well done'})
})

export default router