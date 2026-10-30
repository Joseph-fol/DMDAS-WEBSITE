const User = require("../models/user.model");
const { fetchPaystackBanks } = require("./paystack");
const { invalidateRepPortal } = require("../util/redis");

const resolveAccountDetail = async (req, res) => {
  const { accountNumber, bankName } = req.body;

  if (!accountNumber || !bankName) {
    return res.status(400).json({
      message: "Account number and bank name are required.",
    });
  }

  try {
    const banksData = await fetchPaystackBanks();
    const bank = banksData.find((b) => b.name.toLowerCase() === bankName.toLowerCase());

    if (!bank) {
      return res.status(200).json({
        verificationFailed: true,
        message: "Automatic verification failed for this bank. Please enter your account name manually.",
        accountNumber,
        bankName,
      });
    }

    const bankCode = bank.code;
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    if (!data.status) {
      if ((data.message || "").toLowerCase().includes("could not resolve account")) {
        return res.status(200).json({
          verificationFailed: true,
          message: "Automatic verification failed. Please enter your account name manually.",
          accountNumber,
          bankName: bank.name,
        });
      }

      return res.status(400).json({ message: data.message || "Could not validate account details." });
    }

    res.status(200).json({
      accountName: data.data.account_name,
      accountNumber: data.data.account_number,
      bankName: bank.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while resolving account details", error: error.message });
  }
};

const saveAccountDetail = async (req, res) => {
  const { accountNumber, accountName, bankName } = req.body;

  if (!accountNumber || !accountName || !bankName) {
    return res.status(400).json({
      message: "Account number, account name, and bank name are required.",
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const banksData = await fetchPaystackBanks();
    const bank = banksData.find((b) => b.name.toLowerCase() === bankName.toLowerCase());

    user.settlementAccount = {
      accountNumber,
      accountName,
      bankName: bank ? bank.name : bankName,
      bankCode: bank ? bank.code : null,
    };

    await user.save();
    await invalidateRepPortal(req.user._id);

    res.status(200).json({
      message: "Account details saved successfully.",
      accountDetails: user.settlementAccount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while saving account details", error: error.message });
  }
};

const editBankDetails = async (req, res) => {
  const repId = req.user._id;
  const { accountNumber, accountName, bankName, bankCode } = req.body;

  if (!accountNumber || !accountName || !bankName) {
    return res.status(400).json({
      message: "Account number, account name, and bank name are required.",
    });
  }

  try {
    const user = await User.findById(repId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.settlementAccount = {
      accountNumber,
      accountName,
      bankName,
      bankCode: bankCode || user.settlementAccount?.bankCode || null,
    };

    await user.save();
    await invalidateRepPortal(repId);

    return res.status(200).json({
      message: "Bank details updated successfully.",
      accountDetails: user.settlementAccount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while updating bank details",
      error: error.message,
    });
  }
};

const validateToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Input field is required" });
  }

  return res.status(200).json({ message: "Token is valid." });
};

const deleteUserAccount = async () => {
  // intentionally left as a placeholder for future implementation
};

module.exports = {
  resolveAccountDetail,
  saveAccountDetail,
  editBankDetails,
  validateToken,
  deleteUserAccount,
};
