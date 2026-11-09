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
  validateSignup,
  signinValidation,
  requestPinValidation,
  resetPinValidation,
  updatePinValidation,
  updateProfileValidation,
  checkErrors,
} = require("../validators/validateMiddleware");
const {
  getNotifications,
  markNotificationsRead,
} = require("../controllers/notification.controller");

router.post("/signup", authLimiter, validateSignup, checkErrors, userSignup);
router.post("/signin", authLimiter, signinValidation, checkErrors, userSignin);
router.post("/requestPin", emailLimiter, requestPinValidation, checkErrors, requestPinReset);
router.post("/requestPinByEmail", emailLimiter, requestPinValidation, checkErrors, requestPinResetByEmail);
router.post("/resetPin", resetPinValidation, checkErrors, resetPinWithOTP);
router.get("/profile", verifyToken, getUserProfile);
router.get("/student/profile", verifyToken, getUserProfile);
router.get("/notifications", verifyToken, getNotifications);
router.patch("/notifications/read", verifyToken, markNotificationsRead);
router.put("/updatePinSetting", verifyToken, updatePinValidation, checkErrors, resetPasswordSetting);
router.put("/updateProfileSetting", verifyToken, updateProfileValidation, checkErrors, updateProfileSettings);

module.exports = router;
