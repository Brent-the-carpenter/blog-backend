import express from "express";
import {
  getComment,
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import authenticate from "../middleware/authenticate.js";
import checkPermissions from "../middleware/checkRole.js";
const router = express.Router({ mergeParams: true });

// GET all comments
router.get("/", getComments);
//  GET comment by id
router.get("/:commentId", getComment);
//POST comment
router.post("/", authenticate(), createComment);
//PUT update  comment
router.put("/:commentId", authenticate(), checkPermissions, updateComment);
// DELETE comment
router.delete("/:commentId", authenticate(), checkPermissions, deleteComment);

export default router;
