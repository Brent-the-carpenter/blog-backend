import express from "express";
import multer from "multer";
import authenticate from "../middleware/authenticate.js";
import checkPermissions from "../middleware/checkRole.js";
import commentRouter from "./commentRoute.js";
import {
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
} from "../controllers/postController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
//GET all post
router.get("/", getPosts);

//GET post by id
router.get("/:postId", getPost);

//POST Create new post
router.post(
  "/",
  upload.array("images", 3),
  authenticate(),
  checkPermissions,
  createPost
);

//PUT Update  post by id
router.put(
  "/:postId",
  upload.array("images", 3),
  authenticate(),
  checkPermissions,
  updatePost
);

//Delete post by id
router.delete("/:postId", authenticate(), checkPermissions, deletePost);

router.post("/:postId/like", authenticate(), likePost);

export default router;
