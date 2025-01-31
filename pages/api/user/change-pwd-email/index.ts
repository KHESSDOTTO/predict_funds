import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import UserModel from "@/database/models/user/userModel";
import { track } from "@vercel/analytics/server";

async function SendPwdUpdateEmail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(500).send("Only post method accepted on this endpoint.");
  }

  if (!req.body) {
    return res.status(500).send("No body was sent with the request.");
  }

  try {
    await connect();
    const user = await UserModel.findOne({ ...req.body });

    if (!user) {
      return res.status(500).send("No user was found.");
    }

    const updUser = await UserModel.insertUpdateChangeId(String(user._id));
    await UserModel.sendPwdUpdateEmail(updUser._id, updUser.changeId);

    track(
      "sent_pwd_reset_email",
      {
        userId: String(user['_id']),
        userName: user['username']
      }
    )

    return res.status(200).send("Sent e-mail.");
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err}`);
  }
}

export default SendPwdUpdateEmail;
