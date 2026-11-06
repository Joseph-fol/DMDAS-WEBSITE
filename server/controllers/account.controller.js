const User = require("../models/user.model");
const { fetchPaystackBanks } = require("./paystack");
const { invalidateRepPortal } = require("../util/redis");

const normalizeAccountNumber = (accountNumber) =>
  String(accountNumber || "").replace(/\D/g, "");

const findBank = (banks, bankCode, bankName) => {
  const normalizedCode = String(bankCode || "").trim();
  const normalizedName = String(bankName || "").trim().toLowerCase();

  return banks.find(
    (bank) =>
      (normalizedCode && bank.code === normalizedCode) ||
      (normalizedName && bank.name.toLowerCase() === normalizedName),
  );
};

const resolveWithPaystack = async ({ accountNumber, bankCode }) => {
  const response = await fetch(
    `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(
      accountNumber,
    )}&bank_code=${encodeURIComponent(bankCode)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );
  const data = await response.json();

  if (!response.ok || !data.status || !data.data?.account_name) {
    const error = new Error(
      data.message || "Could not validate account details.",
    );
    error.statusCode = response.ok ? 422 : response.status;
    throw error;
  }

  return data.data;
};

const getBankFromRequest = async ({ bankCode, bankName }) => {
  const banks = await fetchPaystackBanks();
  return findBank(banks, bankCode, bankName);
};

const resolveAccountDetail = async (req, res) => {
  const { accountNumber, bankName, bankCode } = req.body;
  const normalizedAccountNumber = normalizeAccountNumber(accountNumber);

  if (!/^\d{10}$/.test(normalizedAccountNumber) || (!bankName && !bankCode)) {
    return res.status(400).json({
      message: "A valid 10-digit account number and bank are required.",
    });
  }

  try {
    const bank = await getBankFromRequest({ bankCode, bankName });
    if (!bank) {
      return res.status(404).json({
        message: "The selected bank was not found on Paystack.",
      });
    }

    const account = await resolveWithPaystack({
      accountNumber: normalizedAccountNumber,
      bankCode: bank.code,
    });

    return res.status(200).json({
      accountName: account.account_name,
      accountNumber: account.account_number,
      bankName: bank.name,
      bankCode: bank.code,
    });
  } catch (error) {
    const statusCode = error.statusCode || 502;
    console.error("Error resolving account details:", error);
    return res.status(statusCode).json({ message: error.message });
  }
};

const saveAccountDetail = async (req, res) => {
  const { accountNumber, bankName, bankCode } = req.body;
  const normalizedAccountNumber = normalizeAccountNumber(accountNumber);

  if (!/^\d{10}$/.test(normalizedAccountNumber) || (!bankName && !bankCode)) {
    return res.status(400).json({
      message: "A valid 10-digit account number and bank are required.",
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const bank = await getBankFromRequest({ bankCode, bankName });
    if (!bank) {
      return res.status(404).json({
        message: "The selected bank was not found on Paystack.",
      });
    }

    const resolvedAccount = await resolveWithPaystack({
      accountNumber: normalizedAccountNumber,
      bankCode: bank.code,
    });

    user.settlementAccount = {
      accountNumber: resolvedAccount.account_number,
      accountName: resolvedAccount.account_name,
      bankName: bank.name,
      bankCode: bank.code,
    };

    await user.save();
    await invalidateRepPortal(req.user._id);

    return res.status(200).json({
      message: "Account details saved successfully.",
      accountDetails: user.settlementAccount,
    });
  } catch (error) {
    const statusCode = error.statusCode || 502;
    console.error("Error saving account details:", error);
    return res.status(statusCode).json({ message: error.message });
  }
};

const editBankDetails = saveAccountDetail;

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
