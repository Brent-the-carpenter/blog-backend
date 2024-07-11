import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    category: { type: String, required: true },
    author: { type: Schema.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    thumbNail: { type: String },
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PostSchema.index({ author: 1 });
PostSchema.index({ title: 1 });

export default mongoose.model("Post", PostSchema);
