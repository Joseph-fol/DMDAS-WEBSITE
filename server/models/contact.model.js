const mongoose = require("mongoose")

const contactModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    universityName: {
        type: String,
        required: true,
        trim: true
    },

    officialGmail: {
        type: String,
        required: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },

    subject: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },
})

module.exports = mongoose.model("Mail", contactModel)