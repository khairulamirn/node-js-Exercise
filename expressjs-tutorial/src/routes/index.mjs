import { Router } from "express";
import userRouter from "./users.mjs";
import productsRouter from "./products.mjs"
import authRouter from "./auth.mjs";
import cartRouter from "./cart.mjs";

const router = Router();

router.use(userRouter);
router.use(productsRouter);
router.use(authRouter);
router.use(cartRouter);

export default router;