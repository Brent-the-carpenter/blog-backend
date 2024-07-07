#!/user/bin/env node --env-file=.env

import mongoose from "mongoose";
import User from "./models/user.js";
import Comment from "./models/comment.js";
import Post from "./models/post.js";
import jwt from "jsonwebtoken";
mongoose.set("strictQuery", false);

const MONGOURI = process.env.MONGO_URI;

async function Main() {
  console.log(`Connecting to MongoDB`);
  await mongoose.connect(MONGOURI);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("Creating users");
    await createUsers(session);

    console.log("Creating Post");
    await createPosts(session);

    console.log("Creating comments and updating user and post refs");
    const comments = await createComments(session);

    await session.commitTransaction();

    await updatePostAndUserCommentFields(comments);
    console.log("Successfully populated DB");
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
  } finally {
    session.endSession();
    console.log("Session closed");
    await mongoose.connection.close();
  }
}

Main();

/* 
Create users first , because there ref to comments is not required.
Then create post using user id for required author id . 
Then make comments from user and update user's comments 
array with comment id also update post comment array with comment id
*/
let users = [];
let posts = [];

async function createUsers(session) {
  users = await Promise.all([
    createUser("User1", "FirstUser", "UserOne", "User1test2024.", session),
    createUser("User2", "SecondUser", "UserTwo", "User2test2024.", session),
    createUser("User3", "ThirdUser", "UserThree", "User3test2024.", session),
    createUser("User4", "FourthUser", "UserFour", "User4test2024.", session),
  ]);
  console.log("Finished making users.");
}
async function createPosts(session) {
  posts = await Promise.all([
    createPost(
      "Game Design",
      users[0]._id,
      "Game design using C++",
      "This is a post about game design",
      2,
      false,
      session
    ),
    createPost(
      "Web Development",
      users[1]._id,
      "Introduction to HTML",
      "This is a post about HTML",
      5,
      true,
      session
    ),
    createPost(
      "Data Science",
      users[2]._id,
      "Exploring Machine Learning",
      "This is a post about machine learning",
      3,
      true,
      session
    ),
  ]);
}
async function createComments(session) {
  const comments = await Promise.all([
    createComment(
      users[0]._id,
      "Web development is awesome",
      posts[1]._id,
      session
    ),
    createComment(users[1]._id, "I love game design", posts[0]._id, session),
    createComment(
      users[2]._id,
      "Machine learning is fascinating",
      posts[2]._id,
      session
    ),
  ]);
  return comments;
}

async function updatePostAndUserCommentFields(comments) {
  // update users ref's

  await Promise.all(
    comments.map(async (comment) => {
      const user = await User.findById(comment.user);
      if (!user) {
        console.log(`no user found for comment ${comment._id}`);
      }
      user.comments.push(comment._id);
      await user.save();
    })
  );
  await Promise.all(
    comments.map(async (comment) => {
      const post = await Post.findById(comment.post);
      if (!post) {
        console.log(`no post found for comment ${comment._id}`);
      }
      post.comments.push(comment._id);
      await post.save();
    })
  );
}

// Role is set by default to user
async function createUser(first_name, last_name, user_name, password, session) {
  try {
    const user = new User({
      first_name,
      last_name,
      user_name,
      password,
      auth_token: first_name,
    });
    await user.save({ session });
    const authToken = jwt.sign({ user_name, id: user._id }, "cat", {
      expiresIn: "2 days",
    });
    user.auth_token = authToken;
    await user.save({ session });
    console.log(`User ${user.user_name} created`);
    return user;
  } catch (error) {
    console.log("Error creating user");
    throw error;
  }
}
// Requires comments id and user id for author
async function createPost(
  category,
  author,
  title,
  content,
  likes,
  published,
  session
) {
  try {
    const post = new Post({
      category,
      author,
      title,
      content,
      likes,
      published,
    });
    await post.save({ session });
    console.log(`Post ${post.title} created`);
    return post;
  } catch (error) {
    console.log("Error creating post", error);
    throw error;
  }
}
// Requires post id and user id for refs
async function createComment(user, message, post, session) {
  try {
    const comment = new Comment({
      message,
      post,
      user,
    });
    await comment.save({ session });
    console.log("Comment created");
    return comment;
  } catch (error) {
    console.log("Error creating comment", error);
    throw error;
  }
}
