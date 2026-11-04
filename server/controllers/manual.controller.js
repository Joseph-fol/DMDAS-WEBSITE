const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const AddManual = require("../models/manual.model");
const Notification = require("../models/notification.model");
const {
  getJson,
  setJson,
  getManualCatalogVersion,
  getRepPortalVersion,
  invalidateManualCatalog,
  invalidateRepPortal,
} = require("../util/redis");

const addManual = async (req, res) => {
  const { courseCode, courseTitle, price, printedStock, semester } = req.body;
  const repId = req.user._id;

  if (
    !courseCode ||
    !courseTitle ||
    price === undefined ||
    price === null ||
    printedStock === undefined ||
    printedStock === null ||
    !["Harmattan", "Rain"].includes(semester)
  ) {
    return res.status(400).json({ message: "All manual fields are required." });
  }

  try {
    const newManual = await AddManual.create({
      courseCode,
      courseTitle,
      price,
      printedStock,
      semester,
      addedBy: repId,
    });

    try {
      const students = await User.find({
        role: "student",
        department: req.user.department,
        level: req.user.level,
      })
        .select("_id")
        .lean();

      if (students.length > 0) {
        await Notification.insertMany(
          students.map((student) => ({
            user: student._id,
            title: "New course manual available",
            message: `${courseCode} - ${courseTitle} is now available for purchase.`,
            type: "manual_available",
          })),
        );
      }
    } catch (notificationError) {
      console.error("Error notifying students about new manual:", notificationError);
    }
    
    await invalidateManualCatalog();
    await invalidateRepPortal(repId);

    return res.status(201).json({
      message: "Manual successfully added.",
      manual: newManual,
    });
  } catch (error) {
    console.error("Error adding manual:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: `A manual with course code '${courseCode}' already exists.` });
    }
    return res.status(500).json({
      message: "Error adding manual",
      error: error.message,
    });
  }
};

const editManual = async (req, res) => {
  const { id } = req.params;
  const repId = req.user._id;
  const { courseCode, courseTitle, price, printedStock, isAvailable } = req.body;

  const isStatusUpdate =
    typeof isAvailable === "boolean" &&
    courseCode === undefined &&
    courseTitle === undefined &&
    price === undefined &&
    printedStock === undefined;

  if (
    !isStatusUpdate &&
    (!courseCode ||
      !courseTitle ||
      price === undefined ||
      price === null ||
      printedStock === undefined ||
      printedStock === null)
  ) {
    return res.status(400).json({ message: "All manual fields are required." });
  }

  try {
    const manual = await AddManual.findById(id);
    if (!manual) {
      return res.status(404).json({ message: "Manual not found" });
    }

    if (manual.addedBy.toString() !== repId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only edit manuals you have added.",
      });
    }

    const manualUpdates = isStatusUpdate
      ? { isAvailable }
      : { courseCode, courseTitle, price, printedStock };

    const editedManual = await AddManual.findByIdAndUpdate(id, manualUpdates, { returnDocument: "after" });
    await invalidateManualCatalog();
    await invalidateRepPortal(repId);

    res.status(200).json({
      message: "Manual successfully updated.",
      manual: editedManual,
    });
  } catch (error) {
    console.log("Error editing manual");
    return res.status(500).json({
      message: "Failed to update manual",
      error: error.message,
    });
  }
};

const deleteManual = async (req, res) => {
  const { id } = req.params;
  const repId = req.user._id;

  try {
    const manual = await AddManual.findById(id);
    if (!manual) {
      return res.status(404).json({ message: "Manual not found." });
    }

    if (manual.addedBy.toString() !== repId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only delete manuals you have added.",
      });
    }

    await AddManual.findByIdAndDelete(id);
    await invalidateManualCatalog();
    await invalidateRepPortal(repId);

    res.status(200).json({ message: "Manual successfully deleted." });
  } catch (error) {
    console.log("Error deleting manual:", error);
    return res.status(500).json({
      message: "Failed to delete manual.",
      error: error.message,
    });
  }
};

const getRepManuals = async (req, res) => {
  try {
    const version = await getRepPortalVersion(req.user._id);
    const cacheKey = `rep:portal:${req.user._id}:manuals:${version}`;
    const cached = await getJson(cacheKey);
    if (cached) return res.status(200).json(cached);

    const manuals = await AddManual.find({ addedBy: req.user._id })
      .select("courseCode courseTitle semester price isAvailable printedStock claimedCount availableStock stockStatus")
      .populate("addedBy", "fullName email phoneNumber department")
      .lean();

    let response;
    if (manuals.length === 0) {
      console.log("No manuals found for this representative.");
      response = {
        status: false,
        message: "No manuals found for this representative.",
        manuals: [],
      };
    } else {
      console.log("Rep manuals fetched successfully");
      response = { manuals };
    }

    await setJson(cacheKey, response, 30);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching rep manuals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchManual = async (req, res) => {
  try {
    const q = req.body.q ?? req.query.q ?? "";
    const semester = req.body.semester ?? req.query.semester;
    const { department, level } = req.user;

    const purchasedTransactions = await Transaction.find({
      student: req.user._id,
      status: "PAID",
    }).select("manual").lean();
    
    const purchasedManualIds = purchasedTransactions.map((transaction) => transaction.manual);

    const repsInDepartment = await User.find({ department, level, role: "rep" }).select("_id");
    const repIds = repsInDepartment.map((rep) => rep._id);

    const buildQuery = (restrictToDepartmentReps) => {
      const query = { isAvailable: true, _id: { $nin: purchasedManualIds } };

      if (restrictToDepartmentReps && repIds.length > 0) {
        query.addedBy = { $in: repIds };
      }

      if (q && q.trim().length > 0) {
        const searchTerm = q.trim();
        query.$or = [
          { courseCode: { $regex: searchTerm, $options: "i" } },
          { courseTitle: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (semester) {
        query.semester = semester;
      }

      return query;
    };

    let manuals = await AddManual.find(buildQuery(true))
      .select("courseCode courseTitle semester price isAvailable printedStock claimedCount availableStock stockStatus addedBy")
      .populate("addedBy", "fullName phoneNumber level department")
      .sort({ courseCode: 1 })
      .lean();

    if (manuals.length === 0) {
      manuals = await AddManual.find(buildQuery(false))
        .select("courseCode courseTitle semester price isAvailable printedStock claimedCount availableStock stockStatus addedBy")
        .populate("addedBy", "fullName phoneNumber level department")
        .sort({ courseCode: 1 })
        .lean();
    }

    return res.status(200).json({
      success: true,
      count: manuals.length,
      data: manuals,
    });
  } catch (error) {
    console.error("[Manual search error]", error.message);
    return res.status(500).json({ success: false, message: "Failed to search for manuals." });
  }
};

const getDepartmentLevelManuals = async (req, res) => {
  try {
    const { department, level } = req.user;
    if (!department || !level) {
      return res.status(400).json({
        success: false,
        message: "Student department or level not found in user data.",
      });
    }

    const catalogVersion = await getManualCatalogVersion();
    const cacheKey = `manuals:available:${catalogVersion}:${req.user._id}`;
    const cachedResponse = await getJson(cacheKey);
    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }

    const sanitizedLevel = level.match(/\d+/)?.[0] || level;

    const purchasedTransactions = await Transaction.find({
      student: req.user._id,
      status: "PAID",
    }).select("manual").lean();

    const purchasedManualIds = purchasedTransactions.map((transaction) => transaction.manual);

    const relevantReps = await User.find({
      department: { $regex: `^${department}$`, $options: "i" },
      $or: [
        { role: "rep", level: sanitizedLevel },
        { role: "superRep", level: sanitizedLevel },
      ],
    }).select("_id");

    const repIds = relevantReps.map((rep) => rep._id);

    if (repIds.length === 0) {
      const response = {
        success: true,
        count: 0,
        data: [],
        message: `No representatives found for your department (${department}) and level (${level}).`,
      };

      await setJson(cacheKey, response);
      return res.status(200).json(response);
    }

    const manuals = await AddManual.find({
      addedBy: { $in: repIds },
      isAvailable: true,
      _id: { $nin: purchasedManualIds },
    })
      .select("courseCode courseTitle semester price isAvailable printedStock claimedCount availableStock stockStatus addedBy")
      .populate("addedBy", "fullName phoneNumber level department")
      .sort({ courseCode: 1 })
      .lean();

    const response = { success: true, count: manuals.length, data: manuals };
    await setJson(cacheKey, response);
    return res.status(200).json(response);
  } catch (error) {
    console.error("[getDepartmentLevelManuals error]", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch manuals for your department and level." });
  }
};

const pickupResponse = (transaction) => ({
  id: transaction._id,
  keycode: transaction.keycode,
  studentName: transaction.student?.fullName,
  matricNumber: transaction.matricNumber || transaction.student?.matricNumber,
  courseCode: transaction.courseCode || transaction.manual?.courseCode,
  courseTitle: transaction.manual?.courseTitle,
  paystackRef: transaction.reference,
  amount: transaction.amount,
  status: transaction.dispatchStatus === "CLAIMED" ? "Collected" : "Ready for Pickup",
  issuedAt: transaction.paymentDate || transaction.createdAt || transaction.date,
  collectedAt: transaction.collectedAt || null,
});

const findPickupByKeycode = async (keycode) => {
  return Transaction.findOne({
    keycode: keycode.toUpperCase(),
    status: "PAID",
  })
    .select("_id keycode student matricNumber manual courseCode reference amount dispatchStatus paymentDate date collectedAt createdAt")
    .populate("student", "fullName matricNumber")
    .populate("manual", "courseCode courseTitle addedBy")
    .lean();
};

const lookupPickup = async (req, res) => {
  const keycode = String(req.body?.keycode ?? req.body?.code ?? req.query.keycode ?? req.query.code ?? "").trim();

  if (!keycode) {
    try {
      const transactions = await Transaction.find({
        status: "PAID",
        dispatchStatus: "UNCLAIMED",
      })
        .sort({ paymentDate: -1, createdAt: -1 })
        .limit(100)
        .select("_id keycode student matricNumber manual courseCode reference amount dispatchStatus paymentDate date collectedAt createdAt")
        .populate("student", "fullName matricNumber")
        .populate("manual", "courseCode courseTitle")
        .lean();
      return res.status(200).json({
        success: true,
        match: null,
        awaitingPickup: transactions.map(pickupResponse),
      });
    } catch (error) {
      console.error("[Pickup list error]", error);
      return res.status(500).json({ success: false, message: "Failed to load pending pickups." });
    }
  }

  if (!/^DM-\d+$/i.test(keycode)) {
    return res.status(400).json({
      success: false,
      message: "A valid pickup keycode (for example, DM-1234) is required.",
    });
  }

  try {
    const transaction = await findPickupByKeycode(keycode);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "No paid manual purchase was found for this keycode.",
      });
    }

    return res.status(200).json({ success: true, data: pickupResponse(transaction) });
  } catch (error) {
    console.error("[Pickup lookup error]", error);
    return res.status(500).json({ success: false, message: "Failed to look up pickup keycode." });
  }
};

const confirmPickup = async (req, res) => {
  const keycode = String(req.body?.keycode ?? "").trim();

  if (!/^DM-\d+$/i.test(keycode)) {
    return res.status(400).json({
      success: false,
      message: "A valid pickup keycode (for example, DM-1234) is required.",
    });
  }

  try {
    const transaction = await findPickupByKeycode(keycode);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "No paid manual purchase was found for this keycode.",
      });
    }

    if (transaction.dispatchStatus === "UNCLAIMED") {
      await Transaction.updateOne(
        { _id: transaction._id, dispatchStatus: "UNCLAIMED" },
        { $set: { dispatchStatus: "CLAIMED", collectedAt: new Date() } }
      );
      await invalidateRepPortal(transaction.manual?.addedBy);
    }

    const updatedTransaction = await findPickupByKeycode(keycode);
    return res.status(200).json({ success: true, data: pickupResponse(updatedTransaction) });
  } catch (error) {
    console.error("[Pickup confirmation error]", error);
    return res.status(500).json({ success: false, message: "Failed to confirm manual pickup." });
  }
};

module.exports = {
  addManual,
  editManual,
  deleteManual,
  getRepManuals,
  searchManual,
  getDepartmentLevelManuals,
  lookupPickup,
  confirmPickup,
};
