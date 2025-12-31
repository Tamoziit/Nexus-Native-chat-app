import express from "express";
import verifyToken from "../middlewares/auth.middleware";
import { sendChatMessage } from "../controllers/chat.controller";

const router = express.Router();

router.post("/send-message/:id", verifyToken, sendChatMessage);

export default router;