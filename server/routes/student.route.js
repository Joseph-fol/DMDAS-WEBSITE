const express = require("express");
const router = express.Router();
const { verifyToken, isStudent } = require("../middleware/auth");
const {
  searchManual,
  getDepartmentLevelManuals,
} = require("../controllers/user.controller");
const {
  initializeTransaction,
  verifyPayment,
  getTransactionHistory,
  getPurchasedManuals,
  handlePaystackWebhook,
} = require("../controllers/paystack");

const idempotency = require("../middleware/idempotency");

const { paymentLimiter } = require("../middleware/ratelimiter")

router.post("/student/initializeTransaction", paymentLimiter, verifyToken, idempotency(), initializeTransaction);
router.get("/student/verifyPayment", verifyToken, verifyPayment);
router.get("/student/transactionHistory", verifyToken, getTransactionHistory);
router.get("/student/purchasedManuals", verifyToken, isStudent, getPurchasedManuals);
router.post("/searchManuals", verifyToken, isStudent, searchManual);
router.get("/student/availableManuals", verifyToken, isStudent, getDepartmentLevelManuals);
router.post("/paystack/webhook", handlePaystackWebhook);

module.exports = router;