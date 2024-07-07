import { Router } from "express";
import healthController from "../controller/health";

const router = Router();

router.get('/health', healthController.getHealth);
router.post('/health', healthController.postHealth);

export default router;

