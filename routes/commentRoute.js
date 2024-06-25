import express from "express";
import {
  getComment,
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
const router = express.Router({ mergeParams: true });

// GET all comments
router.get("/", getComments);
//  GET comment by id
router.get("/:commentId", getComment);
//POST comment
router.post("/", createComment);
//PUT update  comment
router.put("/:commentId", updateComment);
// DELETE comment
router.delete("/:commentId", deleteComment);

export default router;
