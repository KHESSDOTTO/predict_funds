import jwt from "jsonwebtoken";
import type { UserModelDocType } from "@/database/models/user/userType";

function generateToken(user: UserModelDocType) {
  let signature: string;
  const secret = process.env.TOKEN_SIGN_SECRET;

  if (secret) {
    signature = secret;
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
    cnpjs,
    preferences,
  } = user;

  return jwt.sign(
    {
      _id,
      username,
      email,
      address,
      cnpj,
      contactPhone,
      cnpjs,
      preferences,
    },
    signature,
    {
      expiresIn: expiration,
    }
  );
}

function verifyToken(token: string) {
  const secret = process.env.TOKEN_SIGN_SECRET;

  if (secret) {
    try {
      const userToken = jwt.verify(token, secret);

      return userToken;
    } catch (err: any) {
      console.log("Error verifying token:", err.name, err.message);

      throw err;
    }
  }

  return false;
}

export { generateToken, verifyToken };
