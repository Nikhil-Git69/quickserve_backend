import express from "express";
import isVerifiedUser from "../middleware/tokenVerification.js";
import {addOrder, getOrderById, getOrders, updateOrder} from "../controller/orderController.js"

const router = express.Router();


router.post("/",isVerifiedUser, addOrder);
router.get("/",isVerifiedUser, getOrders);
router.get("/:id", isVerifiedUser, getOrderById);
router.put("/:id", isVerifiedUser,updateOrder);

export default router;
