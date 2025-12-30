import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId, // id de mongo
    ref: "User", // lo que esta puesto en mongoose.model("User", userSchema);
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId, //id de category
    ref: "Category",
    required: true,
  },
});

export const ProductModel = mongoose.model("Product", productSchema);
