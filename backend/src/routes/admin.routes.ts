import express from 'express';
import { flushCache, getToken } from '../controllers/admin.controller';
import verifyAdmin from '../middlewares/admin.middleware';

const router = express.Router();

router.post("/get-token", getToken);
router.post("/flush-cache", verifyAdmin, flushCache);

export default router;