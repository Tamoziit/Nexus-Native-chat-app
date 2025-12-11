import express from "express";
import verifyToken from "../middlewares/auth.middleware";
import { exploreAccounts, sendInvite } from "../controllers/explore.controller";

const router = express.Router();

router.get("/explore-accounts", verifyToken, exploreAccounts);
router.post("/send-invite", verifyToken, sendInvite);

export default router;