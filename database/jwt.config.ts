import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

export function generateToken(user: {
  _id: Schema.Types.ObjectId;
  username: String;
  email: String;
  passwordHash: String;
  address: String;
  cnpj: String;
  contactPhone: String;
  products: [Schema.Types.ObjectId];
  createdAt: Date;
  emailConfirm: Boolean;
  isActive: Boolean;
}) {
  let signature: string;
  if (process.env.TOKEN_SIGN_SECRET) {
    signature = process.env.TOKEN_SIGN_SECRET;
  } else {
    signature = "";
  }
  const expiration = "12h";
  const {
    _id,
    username,
    email,
    address,
    cnpj,
    contactPhone,
    emailConfirm,
    isActive,
    createdAt,
  } = user;
  return jwt.sign(
    {
      _id,
      username,
      email,
      address,
      cnpj,
      contactPhone,
      emailConfirm,
      isActive,
      createdAt,
    },
    signature,
    {
      expiresIn: expiration,
    }
  );
}
