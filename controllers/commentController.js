import asyncHandler from "express-async-handler";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import createError from "http-errors";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import debug from "debug";

const debugComment = debug("Comment:");

// GET all comments
const getComments = asyncHandler(async (req, res, next) => {
  try {
    const comments = await Comment.find({}).exec();
    if (!comments) {
      return next(createError(404, "Comments Not Found"));
    }
    return res.status(200).json(comments);
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
});
// GET comment by id
const getComment = asyncHandler(async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).exec();
    if (!comment) {
      return next(createError(404, "Comment Not Found"));
    }
    debugComment(comment);
    return res.status(200).json(comment);
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
});

//Post create new comment
const createComment = [
  body("message", "Message must not be empty").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await session.abortTransaction();
      debugComment("Errors in request validation");
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    console.log(req.user);
    // const post = req.params.postId;
    // const userId = req.user._id;
    if (!req.params.postId) {
      return next(createError(404, "Post not found"));
    }
    if (typeof req.user === "undefined") {
      return next(createError(401, "Authentication required"));
    }
    try {
      // Save new comment
      const comment = new Comment({
        post: req.params.postId,
        message,
        user: req.user._id,
      });
      const newComment = await comment.save({ session });

      // Update users comments field
      await User.findByIdAndUpdate(
        newComment.user,
        { $push: { comments: newComment._id } },
        { session }
      );
      // Update post's comments to include new comments id
      await Post.findByIdAndUpdate(
        newComment.post,
        { $push: { comments: newComment._id } },
        { session }
      );
      await session.commitTransaction();
      const comments = await Comment.find({ post: req.params.postId }, null, {
        sort: { time_stamp: -1 },
      })
        .populate("user")

        .exec();
      return res.status(201).json(comments);
    } catch (error) {
      await session.abortTransaction();

      debugComment(error);
      return next(createError(500, "Internal server error"));
    } finally {
      session.endSession();
    }
  }),
];
//Put update comment
const updateComment = [
  body("message", "Message must not be empty").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const { id, message } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debugComment("Errors in request validation");
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { message, time_stamp: Date.now() },
        { new: true }
      ).exec();
      if (!comment) {
        return res.status(404).json({
          error: "Not Found",
          message: "Comment Not Found",
        });
      }
      return res.status(200).json(comment);
    } catch (error) {
      debugComment(error);
      return next(createError(500, "Internal Server Error"));
    }
  }),
];
const deleteComment = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const commentToDelete = await Comment.findById(
      req.params.commentId
    ).session(session);
    if (!commentToDelete) {
      await session.abortTransaction();
      return next(createError(404, "Comment Not Found"));
    }
    // Remove comment id ref from user
    await User.findByIdAndUpdate(
      commentToDelete.user,
      {
        $pull: { comments: commentToDelete._id },
      },
      { session }
    );
    // remove comment id ref from post
    await Post.findByIdAndUpdate(
      commentToDelete.post,
      { $pull: { comments: commentToDelete._id } },
      { session }
    );
    // Delete comment
    await Comment.findByIdAndDelete(commentToDelete._id).session(session);
    await session.commitTransaction();
    return res.status(204).json({
      message: "204 No Content",
    });
  } catch (error) {
    await session.abortTransaction();
    debugComment(`Error with deleting comment:${error}`);
    return next(createError(500, "Internal Server Error"));
  } finally {
    session.endSession();
  }
});

export { getComment, getComments, createComment, updateComment, deleteComment };
