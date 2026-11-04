const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  userSignup,
  userSignin,
  requestPinReset,
  requestPinResetByEmail,
  resetPinWithOTP,
  resetPasswordSetting,
  updateProfileSettings,
  getUserProfile,
} = require("../controllers/user.controller");

const { authLimiter, emailLimiter } = require("../middleware/ratelimiter")
const {
  getNotifications,
  markNotificationsRead,
} = require("../controllers/notification.controller");

router.post("/signup", authLimiter, userSignup);
router.post("/signin", authLimiter, userSignin);
router.post("/requestPin", emailLimiter, requestPinReset);
router.post("/requestPinByEmail", emailLimiter, requestPinResetByEmail);
router.post("/resetPin", resetPinWithOTP);
router.get("/profile", verifyToken, getUserProfile);
router.get("/student/profile", verifyToken, getUserProfile);
router.get("/notifications", verifyToken, getNotifications);
router.patch("/notifications/read", verifyToken, markNotificationsRead);
router.put("/updatePinSetting", verifyToken, resetPasswordSetting);
router.put("/updateProfileSetting", verifyToken, updateProfileSettings);

module.exports = router;
