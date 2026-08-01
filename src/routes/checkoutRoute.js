import express from "express";
import isVerifiedUser from "../middleware/tokenVerification.js";

import { checkoutOrder, getInvoice } from "../controller/checkoutController.js";

const router = express.Router();

router.put("/checkout/:id", isVerifiedUser,checkoutOrder);

router.get("/invoice/:id",isVerifiedUser,getInvoice);

export default router;







