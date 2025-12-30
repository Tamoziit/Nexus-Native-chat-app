import express from "express";
import verifyToken from "../middlewares/auth.middleware";
import { getUserChatsById, getUserConversations } from "../controllers/conversation.controller";

const router = express.Router();

router.get("/my-conversations", verifyToken, getUserConversations);
router.get("/chat/:id", verifyToken, getUserChatsById);

export default router;