import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2 },
  email: { type: String, required: true, minLength: 2 },
  auth_token: { type: String, unique: true, sparse: true },
  user_name: { type: String, required: true, unique: true, minlength: 4 },
  password: { type: String, required: true, minLength: 12 },
  comments: [{ type: Schema.ObjectId, ref: "Comment" }],
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
});

UserSchema.virtual("fullName").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.index({ auth_token: 1 }, { unique: true, sparse: true });
UserSchema.index({ user_name: 1 }, { unique: true });

export default mongoose.model("User", UserSchema);
