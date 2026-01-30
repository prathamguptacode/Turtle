import express from "express";
import { chat } from "../controller/chatbox.js";
import { userInfo } from "../middleware/userInfo.js";
const router = express.Router();

router.post('/chat',userInfo,chat)

export default router