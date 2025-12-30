import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId, // id de mongo
    ref: "User", // lo que esta puesto en mongoose.model("User", userSchema);
  },
});

export const CategoryModel = mongoose.model("Category", categorySchema);
