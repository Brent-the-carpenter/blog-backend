import asyncHandler from "express-async-handler";
import Post from "../models/post.js";
import createError from "http-errors";

const usersPosts = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const queryLimit = parseInt(req.query.limit, 10) || undefined;

  try {
    let query = Post.find({ author: userId }).sort({ likePost: -1 });

    if (queryLimit) {
      query = query.limit(queryLimit);
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

export { usersPosts };
