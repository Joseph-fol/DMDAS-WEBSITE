const mongoose = require("mongoose")

const manualSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: [true, "Course title is required"],
        trim: true,
    },
    courseCode: {
        type: String,
        required: [true, "Course code is required"],
        unique: true,
        index: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    
    semester: {
        type: String,
        enum: ["Harmattan", "Rain"],
        default: "Harmattan",
        required: true
    },

    printedStock: {
        type: Number,
        default: 0,
        min: [0, "Printed stock cannot be negative"]
    },

    claimedCount: {
        type: Number,
        default: 0
    },

    isAvailable: {
        type: Boolean,
        default: true,
        index: true
    },
    
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    
    toObject: {
        virtuals: true,
    }
})

// Compound index to quickly filter marketplace manuals by department + level + availability
// manualSchema.index({ department: 1, level: 1, isAvailable: 1 });
manualSchema.index({ addedBy: 1, isAvailable: 1 });

// Calculate available stock dynamically
manualSchema.virtual("availableStock").get(function() {
    return this.printedStock - this.claimedCount;
});

// Add a virtual property for stock status
manualSchema.virtual("stockStatus").get(function() {
    const stock = this.availableStock;
    if (stock > 10) {
        return "In Stock";
    } else if (stock > 0 && stock <= 10) {
        return "Low Stock";
    } else {
        return "Out of Stock";
    }
});

const Manual = mongoose.model("Manual", manualSchema)
module.exports = Manual