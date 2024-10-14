import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import UserModel from "@/database/models/user/userModel";

async function GetUserById(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).send("Only get method accepted on this endpoint.");
  }
  const { userId } = req.query;
  try {
    await connect();
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(500).json({ msg: "Could not find the user" });
    }

    delete user.passwordHash;
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong.");
  }
}

export default GetUserById;
