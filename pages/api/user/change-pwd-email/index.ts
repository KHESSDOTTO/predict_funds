import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import {
  insertUpdateChangeId,
  sendPwdUpdateEmail,
} from "@/database/functions/userFunctions";
import UserModel from "@/database/models/userModel";

async function SendPwdUpdateEmail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(500).send("Only post method accepted on this endpoint.");
  }
  if (!req.body) {
    return res.status(500).send("No body was sent with the request.");
  }
  try {
    await connect();
    // console.log("req.body");
    // console.log(req.body);
    const user = await UserModel.findOne({ ...req.body });
    if (!user) {
      return res.status(500).send("No user was found.");
    }
    const updUser = await insertUpdateChangeId(user._id);
    await sendPwdUpdateEmail(updUser._id, updUser.changeId);
    // await disconnect();
    return res.status(200).send("Sent e-mail.");
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err}`);
  }
}

export default SendPwdUpdateEmail;
