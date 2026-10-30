const Transaction = require("../models/transaction.model");
const AddManual = require("../models/manual.model")
const User = require("../models/user.model");


const getStudentOverview = async (req, res) => {
    const studentId = req.user._id;
    let student = null

    let studentProfile = await User.findOne(studentId)
    if (!studentProfile) {
        res.status(404).json({
            success: false,
            message: "Student record not found"
        })
    }

    const [purchasedCount, availableCount, recentAcquisitions] = await Promise.all([
        // Count of total purchased manual by the student
        Transaction.countDocuments({
            student: studentId,
            status: 'paid'
        }),

        // Count total available manuals matching student's level & department
        AddManual.countDocuments({
            level: studentProfile.level,
            department: studentProfile.department,
            isAvailable: true
        }),

        Transaction.find({ student: studentId, paymentStatus: 'PAID' })
        .sort({ createdAt: -1 }).limit(5).select('courseCode claimToken createdAt paymentStatus dispatchStatus').lean()
    ])
}