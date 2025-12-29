import express from "express";
import verifyToken from "../middlewares/auth.middleware";
import { getUserConversations } from "../controllers/conversation.controller";

const router = express.Router();

router.get("/my-conversations", verifyToken, getUserConversations);

export default router;