import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Post from "../models/post.js";
import uploadImage from "../config/cloudinaryConfig.js";
import debug from "debug";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import createError from "http-errors";

const debugPost = debug("Post:");

const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).exec();
  if (!posts.length) {
    return next(createError(404, "Posts not found"));
  }
  return res.status(200).json(posts);
});

const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).exec();
  if (!post) {
    return next(createError(404, "Post not found"));
  }
  return res.status(200).json(post);
});

const createPost = [
  body("content", "Please specify the type of content of this blog.")
    .trim()
    .escape(),

  body("title", "Title of blog post is required.").trim().escape(),
  body("headings.*").escape(),
  body("paragraphs.*").escape(),
  body("published").optional().isBoolean().withMessage("boolean is expected."),

  asyncHandler(async (req, res, next) => {
    const { content, title, headings, paragraphs, published } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const newPost = new Post({
        author: req.user._id,
        content,
        title,
        headings,
        paragraphs,
        published,
      });

      if (req.files && req.files.length) {
        const files = req.files;
        const uploadPromises = files.map((file) => uploadImage(file));
        newPost.images = await Promise.all(uploadPromises);
      }

      const savedPost = await newPost.save();
      return res.status(201).json(newPost);
    } catch (error) {
      debugPost(error);
      return next(createError(500, "An error ocurred"));
    }
  }),
];

const updatePost = [
  body("content", "Please specify the type of content of this blog.")
    .optional()
    .trim()
    .escape(),
  body("title", "Title of blog post is required.").optional().trim().escape(),
  body("headings.*").optional().escape(),
  body("paragraphs.*").optional().escape(),
  body("published").optional().isBoolean().withMessage("boolean is expected."),
  body("_id").notEmpty().withMessage("Post ID is required."),
  asyncHandler(async (req, res, next) => {
    const { id, author, content, title, headings, paragraphs, published } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const updateData = {
        ...(author && { author }),
        ...(content && { content }),
        ...(title && { title }),
        ...(headings && { headings }),
        ...(paragraphs && { paragraphs }),
        ...(published !== undefined && { published }),
      };

      if (req.files && req.files.length) {
        const files = req.files;
        const uploadPromises = files.map((file) => uploadImage(file));
        updateData.images = await Promise.all(uploadPromises);
      } else if (req.body.images) {
        updateData.images = req.body.images;
      }

      const post = await Post.findByIdAndUpdate(id, updateData, {
        new: true,
      }).exec();
      if (!post) {
        return next(createError(404, "Post not found"));
      }
      res.status(200).json(post);
    } catch (error) {
      debugPost(error);
      next(createError(500, "An Error ocurred"));
    }
  }),
];

const deletePost = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Get post and populate all necessary fields
    const postToDelete = await Post.findById(req.params.postId)
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .session(session);
    if (!postToDelete) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Post not found"));
    }

    // Delete comments
    if (postToDelete.comments.length) {
      const commentIds = postToDelete.comments.map((comment) => comment._id);
      await Comment.deleteMany(
        {
          _id: { $in: commentIds },
        },
        { session }
      );

      // Update User refs to comments
      const userIds = postToDelete.comments.map(
        (comment) => comment.author._id
      );
      await User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { comments: { $in: commentIds } } },
        { session }
      );
    }

    // Delete post
    await Post.findByIdAndDelete(postToDelete._id).session(session);
    await session.commitTransaction();
    session.endSession();
    return res.status(204).json({
      message: "204 No Content",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(createError(500, "An error occurred"));
  }
});

export { getPost, getPosts, deletePost, createPost, updatePost };
