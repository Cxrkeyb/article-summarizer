import express from "express";
import {
  getAnswerMessage,
  getArticleSummary,
  getChatHistory,
  getChatHistoryById
} from "./controller/chat";
import verifyJwtInHeaderAndCookie from "@/web/middlewares/verifyJwt";

const router = express.Router();

router.post("/summary", verifyJwtInHeaderAndCookie, getArticleSummary);

router.post("/message", verifyJwtInHeaderAndCookie, getAnswerMessage);

router.get("/history", verifyJwtInHeaderAndCookie, getChatHistory);

router.get("/history/:id", verifyJwtInHeaderAndCookie, getChatHistoryById);

export default router;
