import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Post from "../models/post.js";
import uploadImage from "../config/cloudinaryConfig.js";
import debug from "debug";
const debugPost = debug("Post:");

const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).exec();
  if (!posts.length) {
    return res.status(404).json({
      error: "Not Found",
      message: "Resource not found",
    });
  }
  res.status(200).json(posts);
});

const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();
  if (!post) {
    return res.status(404).json({
      error: "Not Found",
      message: "Resource not found",
    });
  }
  res.status(200).json(post);
});

const createPost = [
  body("content", "Please specify the type of content of this blog.")
    .trim()
    .escape(),

  body("title", "Title of blog post is required.").trim().escape(),
  body("headings.*").escape(),
  body("paragraphs.*").escape(),
  body("published").isBoolean().withMessage("boolean is expected."),

  asyncHandler(async (req, res, next) => {
    const { author, content, title, headings, paragraphs, published } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const imageUrls = [];
      if (req.files && req.files.length) {
        const files = req.files;
        const uploadPromises = files.map((file) => uploadImage(file));
        imageUrls = await Promise.all(uploadPromises);
      }
      const newPost = new Post({
        author,
        content,
        title,
        headings,
        paragraphs,
        images: imageUrls,
        published,
      });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      debugPost(error);
      return next(error);
    }
  }),
];

const updatePost = [
  body("content", "Please specify the type of content of this blog.")
    .trim()
    .escape(),

  body("title", "Title of blog post is required.").trim().escape(),
  body("headings.*").escape(),
  body("paragraphs.*").escape(),
  body("published").isBoolean().withMessage("boolean is expected."),
  asyncHandler(async (req, res, next) => {
    const { _id, author, content, title, headings, paragraphs, published } =
      req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const imageUrls = [];
      if (req.files && req.files.length) {
        const files = req.files;
        const uploadPromises = files.map((file) => uploadImage(file));
        imageUrls = await Promise.all(uploadPromises);
      } else if (req.body.images) {
        imageUrls = req.body.images;
      }
      const updatePost = new Post({
        _id: _id,
        author,
        content,
        title,
        headings,
        paragraphs,
        published,
        images: imageUrls,
      });
      const post = await Post.findByIdAndUpdate(updatePost._id, updatePost, {
        new: true,
      });
      res.status(200).json(post);
    } catch (error) {
      debugPost(error);
      next(error);
    }
  }),
];

const deletePost = asyncHandler(async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id).exec();
    res.status(204).json({
      message: "204 No Content",
    });
  } catch (error) {
    res.status(404).json({ error: "Not Found", message: "Resource not found" });
  }
});

export { getPost, getPosts, deletePost, createPost, updatePost };
