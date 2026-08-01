import express from "express";
import { register, login, getUserData, logout } from "../controller/userController.js";
import isVerifiedUser from "../middleware/tokenVerification.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", isVerifiedUser, logout );

router.get("/", isVerifiedUser, getUserData);

export default router;

