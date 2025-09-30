import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                error: "Not authorized, token missing",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                error: "Not authorized, token invalid",
            });
        }
        const user = await User.findById(decoded.userId).select("-password"); // <-- changed here
        if (!user) {
            return res.status(404).json({
                error: "Not authorized, user not found",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({
            error: "Server error",
        });
    }
}