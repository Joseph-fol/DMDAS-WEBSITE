const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();
const jwtSecretKey = process.env.jwtSecretKey;

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                message: "Authentication token is required. Please login."
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtSecretKey);
        const user = await User.findOne({ matricNumber: decoded.matricNumber }).select("-pin");

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User associated with this token no longer exists."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: false, message: "Authentication failed. The token is invalid or has been altered." });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, message: "Your session has expired. Please login again." });
        }
        
        return res.status(401).json({ status: false, message: "Authentication error. Please login again." });
    }
};

const isRep = (req, res, next) => {
    if (req.user && (req.user.role === 'rep' || req.user.role === 'superRep')) {
        next();
    } else {
        return res.status(403).json({
            status: false,
            message: "Access denied. You do not have permission to perform this action."
        });
    }
};

const isStudent = (req, res, next) =>{
    if(req.user && req.user.role == "student"){
        next()
    } else {
        return res.status(403).json({
            statuse: false,
            message: "Only student can perform this task"
        })
    }
}

module.exports = { verifyToken, isRep, isStudent };