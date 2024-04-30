import express from "express";

// Auth router
import authRouter from "@/web/modules/v1/auth/router";

// User router
import userRouter from "@/web/modules/v1/user/router";

// Chat router
import chatRouter from "@/web/modules/v1/chat/router";

const router = express.Router();

// Auth
router.use("/auth", authRouter);

// User
router.use("/user", userRouter);

// Chat
router.use("/chat", chatRouter);

export default router;
