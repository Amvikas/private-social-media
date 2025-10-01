import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost  } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { commentOnPost } from "../controllers/post.controller.js";
import { likeUnlikePost } from "../controllers/post.controller.js";
import { getAll } from "../controllers/post.controller.js";
import { getlikedPosts } from "../controllers/post.controller.js";
import { getfollowingPosts } from "../controllers/post.controller.js";
import { getUserPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all",protectRoute,getAll);
router.get("/following",protectRoute,getfollowingPosts);
router.get("/likes/:id",protectRoute,getlikedPosts);
router.get("/user/:username",protectRoute,getUserPosts);
router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.post("/like/:id",protectRoute,likeUnlikePost);
router.post("/comment/:id",protectRoute,commentOnPost);  

export default router;