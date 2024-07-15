import express from "express";
import { usersPosts } from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";
const router = express.Router();
router.get("/");
router.get("/posts", authenticate(), usersPosts);
export default router;
