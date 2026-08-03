import express from "express";
import { register, login, getUserData, logout, getAllUserData, deleteUser, setUserRole } from "../controller/userController.js";
import isVerifiedUser from "../middleware/tokenVerification.js";
import isAdminUser from "../middleware/adminVerification.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", isVerifiedUser, logout);
router.get("/allUsers", isVerifiedUser, isAdminUser, getAllUserData)
router.delete("/deleteUser/:id", isVerifiedUser, isAdminUser, deleteUser)
router.put("/setUserRole/:id", isVerifiedUser, isAdminUser, setUserRole)
router.get("/", isVerifiedUser, getUserData);

export default router;

