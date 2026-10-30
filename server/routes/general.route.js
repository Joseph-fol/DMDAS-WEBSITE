const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getBankDetails } = require("../controllers/paystack");
const { uploadProfilePicture } = require("../controllers/uploadProfilePicture");
const { gmailService } = require("../controllers/contactwebsite");

router.get("/banks", getBankDetails);
router.post("/avatar/upload", verifyToken, uploadProfilePicture)
router.post("/sendFeedback", gmailService);

module.exports = router;
