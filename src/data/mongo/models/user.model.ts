import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    default: ["USER_ROLE"],
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
});

// Esto sirve para quitar como se presentan los datos en el json.
// En este caso no mostramos la contraseña, y el _id se ve como (id: 'asjsdjsajs') ya no como _id: 'ajsjdajksa'
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret, options) {
    const { _id, password, ...rest } = ret;
    return { id: _id, ...rest };
  },
});

export const UserModel = mongoose.model("User", userSchema);
