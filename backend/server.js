import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/UserRoutes.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse request body
app.use(express.urlencoded({ extended: true })); // to parse urlencoded data
app.use(cookieParser()); // to parse cookies
app.use("/api/auth", authRoutes);
app.use("/api/user", UserRoutes); 

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
    connectMongoDB();
});