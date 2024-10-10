import jwt from "jsonwebtoken";
import type { UserModelDocType } from "@/database/models/user/userType";

function generateToken(user: UserModelDocType) {
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
  }

  return false;
}

export { generateToken, verifyToken };
