import jwt from "jsonwebtoken";
import type { UserModelDocType } from "@/database/models/user/userType";
import { consoleLog } from "@/functions/functions";

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
  const secret = process.env.TOKEN_SIGN_SECRET;

  if (secret) {
    try {
      const userToken = jwt.verify(token, secret);
      return userToken;
    } catch (err: any) {
      console.log("Error verifying token:", err.name, err.message);

      if (err.name === "TokenExpiredError") {
        console.log("Token has expired");
      } else if (err.name === "JsonWebTokenError") {
        console.log("Invalid token");
      } else {
        console.log("Other error during token verification");
      }

      throw err;
    }
  }

  return false;
}

export { generateToken, verifyToken };
