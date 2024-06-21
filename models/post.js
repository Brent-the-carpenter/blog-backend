import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  comments: [{ type: Schema.ObjectId, required: true }],
});

export default mongoose.model("Post", PostSchema);
