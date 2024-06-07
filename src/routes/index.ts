import express from "express";
import { createItem } from "./addItem";
import { updateItem } from "./updateItem";
import { deleteItem } from "./deleteItem";
import { fetchItems } from "./getItems";
import { fetchItem } from "./getItem";
import { fetchAllItemIds } from "./allID";
import { fetchReport } from "./report";

const router = express.Router();

router.use(fetchAllItemIds);
router.use(createItem);
router.use(updateItem);
router.use(fetchItems);
router.use(deleteItem);
router.use(fetchItem);
router.use(fetchReport);

export { router as apiRouter };
