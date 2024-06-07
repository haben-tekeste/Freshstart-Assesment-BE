import express from 'express'
import { fetchAllItemIds } from '../controllers';

const router = express.Router();


router.get("/ids", fetchAllItemIds)

export {router as fetchAllItemIds}