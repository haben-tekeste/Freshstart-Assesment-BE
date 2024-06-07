import express from 'express'
import { fetchAllItems } from '../controllers'

const router = express.Router()

router.get("/items",fetchAllItems)

export {router as fetchItems}