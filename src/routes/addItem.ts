import express from "express";
import { body } from "express-validator";
import { addItem } from "../controllers";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

router.post(
  "/items",
  [
    body("id").not().isEmpty().trim().withMessage("Item ID is missing"),
    body("name")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Item name is missing"),
    body("quantity")
      .not()
      .isEmpty()
      .withMessage("Quantity is missing")
      .isInt({ min: 0 })
      .withMessage("Quantity should at least be"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("Price is missing")
      .isNumeric()
      .withMessage("Price should be numeric"),
  ],
  validateRequest,
  addItem
);

export { router as createItem };
