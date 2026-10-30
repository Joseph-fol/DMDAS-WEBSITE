const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    matricNumber: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        index: true
    },
    manual: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manual",
        required: true,
        index: true
    },
    courseCode: {
        type: String,
        required: true,
        uppercase: true
    },

    status: {
        type: String,
        required: true,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
        index: true
    },

    reference: {
        type: String,
        required: true,
        unique: true
    },

    keycode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    channel: {
        type: String,
        trim: true
    },

    amount: {
        type: Number,
        required: true
    },

    dispatchStatus: {
        type: String,
        enum: ['UNCLAIMED', 'CLAIMED'],
        default: 'UNCLAIMED',
        index: true
    },

    claimToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    paymentDate: {
        type: Date
    },

    collectedAt: {
        type: Date
    }


}, { timestamps: true })

transactionSchema.index(
    { student: 1, manual: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $in: ["PAID", "PENDING"] } },
    }
);
module.exports = mongoose.model("Transaction", transactionSchema)