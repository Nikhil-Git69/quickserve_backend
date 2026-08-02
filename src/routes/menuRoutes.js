import express from "express";
import isVerifiedUser from "../middleware/tokenVerification.js";
import isAdminUser from "../middleware/adminVerification.js";
import { addMenuItem, getMenuItems, updateMenuItem, deleteMenuItem } from "../controller/menuController.js";

const router = express.Router();

router.get("/", isVerifiedUser, getMenuItems);
router.post("/", isVerifiedUser, isAdminUser, addMenuItem);
router.put("/:id", isVerifiedUser, isAdminUser, updateMenuItem);
router.delete("/:id", isVerifiedUser, isAdminUser, deleteMenuItem);

export default router;
