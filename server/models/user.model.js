const mongoose = require("mongoose")

let userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    
    matricNumber: {
        type: String,
        required: [true, "Matric Number is required"],
        unique: true,
        trim: true,
        uppercase: true
    },

    insitution: {
        type: String,
        default: "LAUTECH"
    },

    department: {
        type: String,
        required: [true, "Department is required"],
        trim: true
    },

    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        max: 11,
        min: 11
    },
    level: {
        type: String,
        required: [true, "Academic level is required"],
        enum: ["100", "200", "300", "400", "500"],
        index: true
    },
    pin: {
        type: String,
        required: [true, "Pin is required"],
        trim: true
    },
    role: {
        type: String,
        enum: ["rep", "student", "superRep"],
        default: "student",
        // required: true,
        index: true
    },
    superRepPasscode: {
        type: String,
        default: null
    },

    settlementAccount: {
        accountNumber: {
            type: String,
            trim: true,
            default: null
        },
        bankName: {
            type: String,
            trim: true,
            default: null
        },
        accountName: {
            type: String,
            trim: true,
            default: null
        },
        bankCode: {
            type: String,
            trim: true,
            default: null
        }
    },

    pinResetOTP: {
        type: String
    },
    pinResetExpires: {
        type: Date
    },
}, { timestamps: true })

// Compound index for finding representatives by department, level, and role
userSchema.index({ department: 1, level: 1, role: 1 });

module.exports = mongoose.model("User", userSchema)