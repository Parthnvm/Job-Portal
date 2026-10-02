import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Check x-access-token header
    if (!token && req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    }

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please log in.",
        success: false,
      });
    }

    const secretKey = process.env.SECRET_KEY || process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("[isAuthenticated] SECRET_KEY / JWT_SECRET environment variable is not defined!");
      return res.status(500).json({
        message: "Authentication configuration error.",
        success: false,
      });
    }

    let decode;
    try {
      decode = jwt.verify(token, secretKey);
    } catch (jwtErr) {
      return res.status(401).json({
        message: jwtErr.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid authentication token.",
        success: false,
      });
    }

    if (!decode || !decode.userId) {
      return res.status(401).json({
        message: "Invalid token payload.",
        success: false,
      });
    }

    // Attach user record and ID to request
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists.",
        success: false,
      });
    }

    req.id = user._id.toString();
    req.user = user;
    return next();
  } catch (error) {
    console.error("[isAuthenticated error]:", error);
    return res.status(500).json({
      message: "Internal server error during authentication.",
      success: false,
    });
  }
};

export default isAuthenticated;