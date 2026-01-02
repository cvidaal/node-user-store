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

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret, options) {
    const { _id, ...rest } = ret;
    return { id: _id, ...rest };
  },
});

export const CategoryModel = mongoose.model("Category", categorySchema);
