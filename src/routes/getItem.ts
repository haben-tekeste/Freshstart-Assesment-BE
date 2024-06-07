import express from "express";
import { fetchItem } from "../controllers";

const router = express.Router();

router.get("/items/:id", fetchItem);

export { router as fetchItem };
