import express from "express";
import verifyToken from "../middlewares/auth.middleware";
import { getCloudinarySignature, updateProfile } from "../controllers/profile.controller";

const router = express.Router();

router.patch("/update", verifyToken, updateProfile);
router.get("/get-signature", verifyToken, getCloudinarySignature);

export default router;