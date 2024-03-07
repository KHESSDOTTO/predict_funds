import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

function generateToken(user: {
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
  cnpjs: string[];
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
    cnpjs,
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
      cnpjs,
    },
    signature,
    {
      expiresIn: expiration,
    }
  );
}

function verifyToken(token: string) {
  if (process.env.TOKEN_SIGN_SECRET) {
    const userToken = jwt.verify(token, process.env.TOKEN_SIGN_SECRET);
    return userToken;
  } else {
    console.log("Token secret not defined");
    return false;
  }
}

export { generateToken, verifyToken };
