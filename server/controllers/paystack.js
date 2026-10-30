const crypto = require("crypto");
const mongoose = require("mongoose");
const Transaction = require("../models/transaction.model");
const Manual = require("../models/manual.model");
const {
    getJson,
    setJson,
    invalidateManualCatalog,
    invalidateTransactionHistory,
    invalidatePurchasedManuals,
    invalidateRepPortal
} = require("../util/redis");
const { sendManualPurchaseConsentEmail } = require("../services/consentEmail.service");
const { sendPaymentConfirmationEmail } = require("../services/paymentConfirmationEmail.service");

const getTransactionMetadata = (data) => {
    const metadata = data.metadata || {};
    const customFields = metadata.custom_fields || [];

    return {
        manualId: metadata.manualId || customFields.find(field => field.variable === "manualId")?.value,
        courseCode: metadata.courseCode || customFields.find(field => field.variable === "courseCode")?.value,
    };
};

const generateKeycode = () => `DM-${crypto.randomInt(1000, 10000)}`;


const initializeTransaction = async (req, res) => {
    const payStackBaseURL = "https://api.paystack.co";
    const { email, fullName, matricNumber } = req.user;
    const { amount, manualId } = req.body;
    const parsedAmount = Number(amount);
    const normalizedMatricNumber = String(matricNumber || "").trim().toUpperCase();

    if (!manualId) {
        return res.status(400).json({ message: "ManualId is required." });
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: "A valid positive amount is required." });
    }

    if (!mongoose.isValidObjectId(manualId)) {
        return res.status(400).json({ message: "Invalid manualId." });
    }

    let initializationStage = "loading manual";

    try {
        const manual = await Manual.findById(manualId);
        if (!manual) {
            return res.status(404).json({ message: "Manual not found." });
        }

        const normalizedCourseCode = String(manual.courseCode || "").toUpperCase().trim();
        if (!normalizedCourseCode) {
            return res.status(400).json({ message: "Manual has no valid course code." });
        }

        if (!process.env.PAYSTACK_SECRET_KEY) {
            console.error("Paystack initialization error: PAYSTACK_SECRET_KEY is not configured.");
            return res.status(500).json({ message: "Payment service is not configured." });
        }

        initializationStage = "calling Paystack";
        const transactionResponse = await fetch(`${payStackBaseURL}/transaction/initialize`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                amount: parsedAmount * 100,
                callback_url: `${process.env.FRONTEND_URL}/purchase-manual/checkout-success`,
                // callback_url: "http://localhost:3000/purchase-manual/checkout-success",
                metadata: {
                    fullName: fullName,
                    matricNumber: matricNumber,
                    manualId: manual._id.toString(),
                    courseCode: normalizedCourseCode,
                },
            }),
        });

        initializationStage = "reading Paystack response";
        const transactionData = await transactionResponse.json();
        console.log(transactionData)

        if (!transactionResponse.ok || !transactionData.status || !transactionData.data?.reference) {
            console.error("Paystack Error initializing transaction:", transactionData);
            return res.status(transactionResponse.status || 502).json({
                message: "Failed to initialize transaction.",
                details: transactionData.message || "Paystack rejected the transaction initialization request.",
            });
        }

        initializationStage = "saving pending transaction";
        const transactionFields = {
            matricNumber: normalizedMatricNumber,
            amount: parsedAmount,
            courseCode: normalizedCourseCode,
            reference: transactionData.data.reference,
            status: "PENDING",
            dispatchStatus: "UNCLAIMED",
        };

        const existingTransaction = await Transaction.findOne({
            student: req.user._id,
            manual: manual._id,
        });

        if (existingTransaction?.status === "PAID") {
            return res.status(409).json({
                message: "You have already paid for this manual.",
                details: "Open your purchased manuals to view the pickup details.",
            });
        }

        if (existingTransaction?.status === "PENDING") {
            await Transaction.updateOne(
                { _id: existingTransaction._id, status: "PENDING" },
                { $set: transactionFields }
            );
        } else {
            await Transaction.create({
                student: req.user._id,
                manual: manual._id,
                keycode: generateKeycode(),
                claimToken: crypto.randomBytes(16).toString("hex"),
                ...transactionFields,
            });
        }

        console.log(`Transaction pending for ${matricNumber} with reference ${transactionData.data.reference}`);

        try {
            await sendManualPurchaseConsentEmail(
                email,
                fullName,
                normalizedCourseCode,
                manual.courseTitle,
                parsedAmount
            );
            console.log(`Manual purchase consent email sent to ${email}`);
        } catch (emailError) {
            console.error("Failed to send manual purchase consent email:", emailError.message);
        }

        return res.status(200).json(transactionData);
    } catch (error) {
        console.error("Error during transaction initialization:", {
            stage: initializationStage,
            name: error.name,
            message: error.message,
            stack: error.stack,
        });

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "The transaction data is invalid.",
                details: error.message,
            });
        }

        return res.status(500).json({
            message: "Payment initialization failed.",
            details: `Failure while ${initializationStage}.`,
        });
    }
};


const handlePaystackWebhook = async (req, res) => {
    //  Validate signature to make sure a hacker didn't fake this payload
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        console.error("Webhook Error: Invalid signature");
        return res.sendStatus(400);
    }

    const event = req.body;

    // Process only when Paystack confirms the charge was successful
    if (event.event === 'charge.success') {
        const reference = event.data.reference;
        const { manualId, courseCode } = getTransactionMetadata(event.data);

        try {
            const transaction = await Transaction.findOne({ reference });
            if (!transaction) {
                console.error(`Webhook Error: Transaction ${reference} was not initialized.`);
                return res.sendStatus(404);
            }

            const update = {
                status: "PAID",
                amount: Number((event.data.amount / 100).toFixed(2)),
                dispatchStatus: "UNCLAIMED",
                channel: event.data.channel,
                paymentDate: event.data.paid_at ? new Date(event.data.paid_at) : new Date(),
            };

            if (manualId && transaction.manual.toString() !== manualId) {
                console.error(`Webhook Error: Manual mismatch for transaction ${reference}.`);
                return res.sendStatus(400);
            }

            if (courseCode) {
                update.courseCode = courseCode;
            }

            await Transaction.findOneAndUpdate(
                { reference: reference },
                { $set: update },
                { returnDocument: "after", runValidators: true }
            );
            await invalidateTransactionHistory(transaction.student);
            
            await invalidatePurchasedManuals(transaction.student);

            await invalidateManualCatalog();

            console.log(`Webhook Success: Transaction ${reference} marked as PAID.`);
        } catch (error) {
            console.error(`Webhook DB Error processing reference ${reference}:`, error);
            return res.sendStatus(500);
        }
    }

    // Always tell Paystack you received the webhook successfully
    res.sendStatus(200);
};


const verifyPayment = async (req, res) => {
    const { reference } = req.query;

    if (!reference) {
        return res.status(400).json({ error: 'Missing payment reference parameter.' });
    }

    try {
        const transaction = await Transaction.findOne({ reference });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        const result = await response.json();

        if (!response.ok || !result.status || !result.data) {
            return res.status(response.status || 502).json({ error: result.message || 'Unable to verify transaction.' });
        }

        const paymentData = result.data;
        if (paymentData.status !== 'success') {
            return res.status(400).json({ error: 'Transaction was not successful.' });
        }

        const storedAmount = Number(transaction.amount);
        if (!Number.isFinite(storedAmount) || paymentData.amount !== storedAmount * 100) {
            return res.status(400).json({ error: 'Payment amount does not match the transaction.' });
        }

        const paidAt = paymentData.paid_at ? new Date(paymentData.paid_at) : new Date();

        const update = {
            status: "PAID",
            dispatchStatus: "UNCLAIMED",
            channel: paymentData.channel,
            paymentDate: paidAt,
        };

        if (!transaction.keycode) {
            update.keycode = generateKeycode();
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { reference },
            { $set: update },
            { returnDocument: "after", runValidators: true }
        ).populate({
            path: "manual",
            select: "courseTitle courseCode addedBy",
            populate: { path: "addedBy", select: "fullName" }
        });
        await invalidateTransactionHistory(transaction.student);
        await invalidateManualCatalog();

        const manual = updatedTransaction.manual;
        if (!manual || !manual.addedBy) {
            return res.status(500).json({ error: "Transaction manual details are unavailable." });
        }
        await invalidateRepPortal(manual.addedBy._id || manual.addedBy);
        const paymentDate = updatedTransaction.paymentDate || updatedTransaction.date;

        const responsePayload = {
            status: "Verified",
            message: "Payment successfully processed!",
            transaction: {
                paystackReference: updatedTransaction.reference,
                channel: updatedTransaction.channel,
                keycode: updatedTransaction.keycode,
                dateOfPayment: paymentDate.toISOString().slice(0, 10),
                timeOfPayment: paymentDate.toISOString().slice(11, 19),
                pickupStatus: updatedTransaction.dispatchStatus,
                amountPaid: updatedTransaction.amount,
                courseCode: updatedTransaction.courseCode,
                courseTitle: manual.courseTitle,
                repName: manual.addedBy.fullName,
            }
        };

        res.status(200).json(responsePayload);

        try {
            await sendPaymentConfirmationEmail({
                email: req.user.email,
                fullName: req.user.fullName,
                courseCode: responsePayload.transaction.courseCode,
                courseTitle: responsePayload.transaction.courseTitle,
                repName: responsePayload.transaction.repName,
                keycode: responsePayload.transaction.keycode,
                amount: responsePayload.transaction.amountPaid,
                paymentDate,
            });
            console.log(`Payment confirmation email sent to ${req.user.email}`);
        } catch (emailError) {
            console.error("Failed to send payment confirmation email:", emailError.message);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getTransactionHistory = async (req, res) => {
    const cacheKey = `transactions:history:${req.user._id}`;
    try {
        const cachedResponse = await getJson(cacheKey);
        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        }

        const transactions = await Transaction.find({
            student: req.user._id,
            status: { $in: ["PAID", "FAILED"] },
        })
            .sort({ paymentDate: -1, date: -1 })
            .populate({
                path: "manual",
                select: "courseTitle addedBy",
                populate: { path: "addedBy", select: "fullName" },
            });

        const transactionHistory = transactions.map(transaction => {
            const manual = transaction.manual;
            const paymentDate = transaction.paymentDate || transaction.date;

            return {
                paystackReference: transaction.reference,
                channel: transaction.channel,
                keycode: transaction.keycode,
                dateOfPayment: paymentDate.toISOString().slice(0, 10),
                timeOfPayment: paymentDate.toISOString().slice(11, 19),
                pickupStatus: transaction.dispatchStatus,
                amountPaid: transaction.amount,
                courseCode: transaction.courseCode,
                courseTitle: manual?.courseTitle,
                repName: manual?.addedBy?.fullName,
            };
        });

        const responsePayload = { transactions: transactionHistory };
        await setJson(cacheKey, responsePayload);

        return res.status(200).json(responsePayload);
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return res.status(500).json({ error: "Unable to fetch transaction history." });
    }
};

const formatPurchaseDate = (date) => {
    if (!date) {
        return null;
    }

    const purchaseDate = new Date(date);
    if (Number.isNaN(purchaseDate.getTime())) {
        return null;
    }

    return `${purchaseDate.toISOString().slice(0, 10)} · ${purchaseDate.toISOString().slice(11, 16)}`;
};

const getPurchasedManuals = async (req, res) => {
    const cacheKey = `purchased:manual:${req.user._id}`
    try {
        const cachedResponse = await getJson(cacheKey)
        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        }

        const transactions = await Transaction.find({
            student: req.user._id,
            status: "PAID",
        })
            .sort({ paymentDate: -1, createdAt: -1 })
            .populate({
                path: "manual",
                select: "courseCode courseTitle price",
            })
            .lean();

        const purchasedManuals = transactions
            .filter(transaction => transaction.manual)
            .map(transaction => ({
                id: transaction._id.toString(),
                courseCode: transaction.manual.courseCode,
                courseTitle: transaction.manual.courseTitle,
                department: req.user.department,
                level: `${req.user.level}L`,
                price: `₦${Number(transaction.manual.price).toLocaleString("en-NG")}`,
                paymentStatus: transaction.status === "PAID" ? "Paid" : "Failed",
                pickupStatus: transaction.status === "FAILED"
                    ? "Failed"
                    : transaction.dispatchStatus === "CLAIMED" ? "Collected" : "Ready for pickup",
                keycode: transaction.keycode,
                createdAt: formatPurchaseDate(transaction.createdAt),
                collectedAt: formatPurchaseDate(transaction.collectedAt),
                studentName: transaction.studentName || req.user.fullName,
                matricNumber: transaction.matricNumber || req.user.matricNumber,
                paystackRef: transaction.reference,
            }));

        const responsePayload = { manuals: purchasedManuals }
        await setJson(cacheKey, responsePayload)
        return res.status(200).json(responsePayload);

    } catch (error) {
        console.error("Error fetching purchased manuals:", error);
        return res.status(500).json({ error: "Unable to fetch purchased manuals." });
    }
};


const fetchPaystackBanks = async () => {
    try {
        const response = await fetch('https://api.paystack.co/bank?country=nigeria', {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        const data = await response.json();

        if (!data.status || !data.data) {
            console.error("Paystack Error fetching banks:", data);
            throw new Error("Failed to fetch banks from Paystack");
        }
        return data.data; // Return the array of bank objects
    } catch (error) {
        console.error("Error in fetchPaystackBanks:", error);
        throw error;
    }
};

const getBankDetails = async (req, res) => {
    try {
        const banksData = await fetchPaystackBanks();
        const bankCodes = banksData.map(bank => bank.code);

        res.json({ bankCodes });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch banks" });
    }
};


module.exports = { initializeTransaction, handlePaystackWebhook, verifyPayment, getTransactionHistory, getPurchasedManuals, getBankDetails, fetchPaystackBanks }