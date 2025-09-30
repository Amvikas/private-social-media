import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse request body
app.use(express.urlencoded({ extended: true })); // to parse urlencoded data
app.use(cookieParser()); // to parse cookies
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
    connectMongoDB();
});