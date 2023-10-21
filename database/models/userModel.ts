import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  passwordHash: { type: String, required: true },
  address: { type: String, rerquired: true, trim: true },
  cnpj: {
    type: String,
    trim: true,
    match: /^[0-9]{14}$/gm,
    unique: true,
    sparse: true,
    required: true,
  },
  contactPhone: {
    type: String,
    trim: true,
    match: /^[0-9]{11,13}$/gm,
    unique: false,
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now() },
  emailConfirm: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true, required: true },
});

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
