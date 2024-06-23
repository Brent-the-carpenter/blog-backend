import express from "express";
import multer from "multer";
import authenticate from "../middleware/authenticate.js";
import checkPermissions from "../middleware/checkRole.js";

import {
  getPost,
  getPosts,
  createPost,
  deletePost,
  updatePost,
} from "../controllers/postController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
//GET all post
router.get("/", getPosts);

//GET post by id
router.get("/:id", getPost);

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
  "/:id",
  upload.array("images", 3),
  authenticate(),
  checkPermissions,
  updatePost
);

//Delete post by id
router.delete("/:id", authenticate(), checkPermissions, deletePost);

export default router;
