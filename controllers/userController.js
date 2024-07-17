import asyncHandler from "express-async-handler";
import Post from "../models/post.js";
import User from "../models/user.js";
import createError from "http-errors";
import debug from "debug";
const UserDebug = debug("User:");
UserDebug.color[20];

const usersPosts = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const queryLimit = parseInt(req.query.limit, 10) || undefined;

  try {
    let query = Post.find({ author: userId }).sort({ likePost: -1 });

    if (queryLimit) {
      query = query.limit(queryLimit);
    }
    if (req.user.role === "admin" && !queryLimit) {
      query = Post.find({}).sort({ createdAt: -1 });
      const posts = await query.exec();
      if (!posts || posts.length === 0) {
        return next(createError(404, "Post not found"));
      }
      return res.status(200).json(posts);
    }

    const postByUser = await query.exec();

    if (!postByUser || postByUser.length === 0) {
      return next(createError(404, "Posts not found"));
    }

    return res.status(200).json(postByUser);
  } catch (error) {
    return next(createError(500, "An error occurred"));
  }
});

const userLikedPosts = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    const likedPost = await User.findById(userId, { likedPosts: 1 })
      .populate({
        path: "likedPosts",
        populate: {
          path: "author",
        },
      })
      .exec();

    if (!likedPost) {
      return next(createError(404, "No post liked"));
    }
    return res.status(200).json(likedPost);
  } catch (error) {
    return next(createError(500, "An error occurred"));
  }
});

export { usersPosts, userLikedPosts };
