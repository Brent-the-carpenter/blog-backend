import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    headings: [{ type: String, minlength: 3 }],
    paragraphs: [{ type: String }],
    images: [{ type: String }],
    comments: [{ type: Schema.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

PostSchema.index({ author: 1 });
PostSchema.index({ title: 1 });

export default mongoose.model("Post", PostSchema);
