import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/UserRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// CORS configuration
app.use(cors({
	origin: process.env.NODE_ENV === 'production' 
		? process.env.FRONTEND_URL 
		: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
	credentials: true
}));

app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

// Health check endpoints
app.get('/api/health', (req, res) => {
	res.status(200).json({ 
		status: 'OK', 
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: process.env.NODE_ENV || 'development'
	});
});

app.get('/api/ready', (req, res) => {
	res.status(200).json({ 
		status: 'Ready',
		message: 'Server is ready to accept requests',
		timestamp: new Date().toISOString()
	});
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});