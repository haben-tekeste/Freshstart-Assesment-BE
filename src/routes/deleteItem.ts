import express from 'express'
import { deleteItem } from '../controllers'

const router = express.Router()

router.delete("/items/:id", deleteItem)

export {router as deleteItem}

