import express from "express";
import { usersPosts, userLikedPosts } from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";
const router = express.Router();
router.get("/");
router.get("/posts", authenticate(), usersPosts);
router.get("/user/likedposts", authenticate(), userLikedPosts);
export default router;
