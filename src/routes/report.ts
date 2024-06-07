import express from "express";
import { prepareReport } from "../controllers";

const router = express.Router();

router.get("/report", prepareReport);

export { router as fetchReport };
