import express from "express";
import verifyToken from "../middlewares/auth.middleware";
import { acceptFriendRequest, exploreAccounts, getFriendRequests, sendInvite } from "../controllers/explore.controller";

const router = express.Router();

router.get("/explore-accounts", verifyToken, exploreAccounts);
router.post("/send-invite", verifyToken, sendInvite);
router.get("/friend-requests", verifyToken, getFriendRequests);
router.post("/accept-request", verifyToken, acceptFriendRequest);

export default router;