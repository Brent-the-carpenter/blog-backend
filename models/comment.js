import mongoose from "mongoose";
import { DateTime } from "luxon";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  time_stamp: { type: Date, default: Date.now(), required: true },
  comment: { type: String, required: true, minLength: 3 },
  post: { type: Schema.ObjectId, ref: "Post", required: true },
});

CommentSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.time_stamp)
    .setZone("local")
    .toLocaleString(DateTime.DATETIME_SHORT);
});

CommentSchema.index({ user: 1 });
CommentSchema.index({ post: 1 });
export default mongoose.model("Comment", CommentSchema);
