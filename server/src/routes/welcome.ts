import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router();

router.get('/',(req: Request,res: Response)=>{
    res.json({message: 'hello world, welcome to Turtle Movies'});
})

export default router