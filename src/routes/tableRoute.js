import express from "express";
import isVerifiedUser from "../middleware/tokenVerification.js";
import {addTable, getTables, updateTable} from "../controller/tableController.js"

const router = express.Router();


router.post("/",isVerifiedUser, addTable);
router.get("/",isVerifiedUser, getTables);
router.put("/:id", isVerifiedUser,updateTable );

export default router;
