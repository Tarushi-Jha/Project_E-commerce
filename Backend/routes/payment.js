import express from "express";
const router = express.Router();

import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
} from "../controllers/paymentControllers.js";

router
  .route("/v1/payment/checkout_session")
  .post(isAuthenticatedUser, stripeCheckoutSession);

router.route("/webhook").post(stripeWebhook);

export default router;
