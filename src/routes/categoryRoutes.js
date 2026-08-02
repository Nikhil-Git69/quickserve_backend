import express from "express";
import isVerifiedUser from "../middleware/tokenVerification.js";
import isAdminUser from "../middleware/adminVerification.js";
import { addCategory, getCategories, updateCategory, deleteCategory } from "../controller/categoryController.js";

const router = express.Router();

router.get("/", isVerifiedUser, getCategories);
router.post("/", isVerifiedUser, isAdminUser, addCategory);
router.put("/:id", isVerifiedUser, isAdminUser, updateCategory);
router.delete("/:id", isVerifiedUser, isAdminUser, deleteCategory);

export default router;
