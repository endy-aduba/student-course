import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

export const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Student.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// NEW Middleware for Admin Access
export const adminAuthenticate = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
  
    if (!token) return res.status(403).json({ error: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Student.findById(decoded.id).select("-password");
  
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
  
