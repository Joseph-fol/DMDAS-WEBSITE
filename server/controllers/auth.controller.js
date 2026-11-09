const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const Notification = require("../models/notification.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendPinResetEmail } = require("../services/resetPin.service");
const { sendWelcomeEmail } = require("../services/welcomeEmail.service");
const { getJson, setJson, deleteKey } = require("../util/redis");

require("dotenv").config();
const jwtSecretKey = process.env.jwtSecretKey;
const PIN_RESET_OTP_TTL_SECONDS = 600; // 10 minutes in seconds
const getPinResetOtpKey = (otp) => `pin-reset:otp:${otp}`;

const userSignup = async (req, res) => {
  const { fullName, email, matricNumber, department, phoneNumber, level, pin, role } = req.body;

  if (!fullName || !email || !matricNumber || !department || !phoneNumber || !level || !pin || !role) {
    return res.status(400).json({ message: "All input fields are required" });
  }

  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      console.log("User already exists");
      return res.status(409).json({ message: "User already exists", email: userExists.email });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);
    const sanitizedLevel = level.match(/\d+/)?.[0] || level;

    const newUserInformation = new User({
      fullName,
      email,
      matricNumber,
      department,
      phoneNumber,
      level: sanitizedLevel,
      pin: hashedPin,
      role: role === "rep" ? "rep" : "student",
    });

    await newUserInformation.save();
    await Notification.create({
      user: newUserInformation._id,
      title: "Welcome to DMDAS",
      message: "Your student account is ready for manual purchases and pickup.",
      type: "welcome",
    });
    console.log("User details successfully saved");

    try {
      await sendWelcomeEmail(newUserInformation.email, newUserInformation.fullName);
      console.log(`Welcome email sent to ${newUserInformation.email}`);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
    }

    const token = jwt.sign({ matricNumber }, jwtSecretKey, { expiresIn: "1hr" });
    return res.status(201).json({
      status: "Successful",
      message: "User details successfully saved",
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

const userSignin = async (req, res) => {
  const { pin, matricNumber } = req.body;

  if (typeof matricNumber !== "string" || typeof pin !== "string") {
    return res.status(400).json({
      message: "Matric number and pin must be strings",
    });
  }

  if (!pin || !matricNumber) {
    return res.status(400).json({ message: "Matric number and pin are required" });
  }

  try {
    const foundUser = await User.findOne({ matricNumber });
    if (!foundUser) {
      console.log("Invalid matric number");
      return res.status(401).json({ message: "Invalid Matric Number or pin" });
    }

    const isMatch = await bcrypt.compare(pin, foundUser.pin);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Matric Number or pin" });
    }

    const token = jwt.sign({ matricNumber }, `${jwtSecretKey}`, { expiresIn: "1hr" });
    console.log("User successfully sign in");
    return res.status(200).json({
      message: "User successfully signin",
      name: foundUser.fullName,
      matricNumber: foundUser.matricNumber,
      id: foundUser._id,
      email: foundUser.email,
      level: foundUser.level,
      department: foundUser.department,
      role: foundUser.role,
      phoneNumber: foundUser.phoneNumber,
      token,
    });
  } catch (error) {
    console.log("Error during signin", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfileSettings = async (req, res) => {
  const userId = req.user._id;
  const { fullName, email, matricNumber, department, phoneNumber, level } = req.body;

  if (!fullName || !email || !matricNumber || !department || !phoneNumber || !level) {
    return res.status(400).json({ message: "All input fields are required" });
  }

  try {
    const userDetail = await User.findById(userId);
    if (!userDetail) {
      return res.status(404).json({ message: "User not found" });
    }

    userDetail.fullName = fullName;
    userDetail.email = email;
    userDetail.matricNumber = matricNumber;
    userDetail.department = department;
    userDetail.phoneNumber = phoneNumber;
    userDetail.level = level;

    await userDetail.save();
    return res.status(201).json({ message: "User details successfully updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestPinReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with the provided email." });
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    await setJson(
      getPinResetOtpKey(generatedOTP),
      { email: user.email },
      PIN_RESET_OTP_TTL_SECONDS
    );

    await sendPinResetEmail(user.email, user.fullName, generatedOTP);
    console.log(`OTP sent to ${user.email}`);

    res.status(200).json({ message: "If an account with this email exists, a PIN reset code has been sent." });

  } catch (error) {
    console.error("Error during requestPinReset:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestPinResetByEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`PIN reset request for non-existent email: ${email}`);
      return res.status(200).json({
        message: "If an account with this email exists, a PIN reset code has been sent.",
      });
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    await setJson(
      getPinResetOtpKey(generatedOTP),
      { email: user.email },
      PIN_RESET_OTP_TTL_SECONDS
    );

    await sendPinResetEmail(user.email, user.fullName, generatedOTP);
    console.log(`PIN reset OTP sent to ${user.email}`);
    res.status(200).json({ message: "A PIN reset code has been sent to your registered email address." });
  } catch (error) {
    console.error("Error during requestPinResetByEmail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPinWithOTP = async (req, res) => {
  const { otp, newPin, confirmPin } = req.body;

  if (!otp || !newPin || !confirmPin) {
    return res.status(400).json({ message: "All fields of the inputs are required." });
  }

  if (newPin !== confirmPin) {
    return res.status(400).json({ message: "New PIN and confirm PIN do not match." });
  }

  try {
    const cachedOtp = await getJson(getPinResetOtpKey(otp));
    const user = cachedOtp ? await User.findOne({ email: cachedOtp.email }) : null;

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    user.pin = await bcrypt.hash(newPin, salt);

    await user.save();
    await deleteKey(getPinResetOtpKey(otp));
    res.status(200).json({ message: "Your PIN has been successfully reset." });
    
  } catch (error) {
    console.error("Error during resetPinWithOTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPasswordSetting = async (req, res) => {
  const matricNumber = req.user.matricNumber;
  const { currentPin, newPin, confirmNewPin } = req.body;

  if (!currentPin || !newPin || !confirmNewPin) {
    return res.status(400).json({ message: "All input fields are required" });
  }

  if (newPin !== confirmNewPin) {
    return res.status(400).json({ message: "New PIN and confirm PIN do not match." });
  }

  try {
    const userDetails = await User.findOne({ matricNumber });

    const isMatch = await bcrypt.compare(currentPin, userDetails.pin);
    if (!isMatch) {
      console.log("Current pin does not match the original pin");
      return res.status(404).json({
        status: false,
        message: "Current pin does not correlate with the original pin",
      });
    }

    const salt = await bcrypt.genSalt(10);
    userDetails.pin = await bcrypt.hash(newPin, salt);

    await userDetails.save();
    res.status(200).json({ message: "PIN has been reset successfully." });
  } catch (error) {
    console.log("Error during resetPasswordSetting", error);
    res.status(500).json({
      message: "Internal Server Error",
      details: "Failed to retrieve user pin",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const paidTransactions = await Transaction.find({
      student: req.user._id,
      status: "PAID",
    })
      .select("amount")
      .lean();

    const totalSpent = paidTransactions.reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0,
    );

    res.status(200).json({
      ...req.user.toObject(),
      purchasedManuals: paidTransactions.length,
      totalSpent: `₦${totalSpent.toLocaleString("en-NG")}`,
      keycodesIssued: paidTransactions.length,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  userSignup,
  userSignin,
  updateProfileSettings,
  requestPinReset,
  requestPinResetByEmail,
  resetPinWithOTP,
  resetPasswordSetting,
  getUserProfile,
};
