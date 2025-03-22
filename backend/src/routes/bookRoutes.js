import express from "express";
import { createBook, deleteBook, getBooks, getUserBooks } from "../controllers/bookController.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createBook);

router.get("/", protectRoute, getBooks);

router.get("/user", protectRoute, getUserBooks);

router.delete("/:id", protectRoute, deleteBook);

export default router;
