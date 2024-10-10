import type { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@/database/models/user/userModel";
import { connect } from "@/database/database.config";

async function CreateUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).send("Only POST method accepted on this endpoint.");
  }
  try {
    await connect();
    const newUser = await UserModel.doCreateUser(req.body);
    // await disconnect();
    if (newUser) {
      return res.status(newUser.status).json(newUser.msg);
    }
    return res.status(500).json("newUser returned null/falsy.");
  } catch (err) {
    // await disconnect();
    return res.status(500).json(err);
  }
}

export default CreateUser;
