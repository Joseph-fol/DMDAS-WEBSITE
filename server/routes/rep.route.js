const express = require("express");
const router = express.Router();
const { verifyToken, isRep } = require("../middleware/auth");
const {
  addManual,
  getRepManuals,
  editManual,
  deleteManual,
  lookupPickup,
  confirmPickup,
  resolveAccountDetail,
  saveAccountDetail,
  editBankDetails,
} = require("../controllers/user.controller");
const overview = require("../controllers/repOverview.controller");

router.get("/admin/dashboard", verifyToken, isRep, overview.dashboard);
router.get("/students", verifyToken, isRep, overview.students);
router.get("/settlement", verifyToken, isRep, overview.settlement);
router.post("/settlement/withdraw", verifyToken, isRep, overview.withdraw);
router.get("/reports", verifyToken, isRep, overview.reports);
router.get("/history", verifyToken, isRep, overview.history);
router.get("/messages", verifyToken, isRep, overview.messages);

router.post("/rep/addManual", verifyToken, isRep, addManual);
router.get("/rep/getManual", verifyToken, isRep, getRepManuals);
router.put("/rep/editManual/:id", verifyToken, isRep, editManual);
router.delete("/rep/deleteManual/:id", verifyToken, isRep, deleteManual);
router.get("/rep/pickup", verifyToken, isRep, lookupPickup);
router.post("/rep/pickup/confirm", verifyToken, isRep, confirmPickup);
router.get("/keycode/verify", verifyToken, isRep, lookupPickup);
router.post("/keycode/confirm", verifyToken, isRep, confirmPickup);
router.post("/rep/resolveAccount", verifyToken, isRep, resolveAccountDetail);
router.post("/rep/saveAccount", verifyToken, isRep, saveAccountDetail);
router.post("/rep/editBankDetails/", verifyToken, isRep, editBankDetails);
router.put("/settlement/account", verifyToken, isRep, editBankDetails);

module.exports = router;
