import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import UserModel from "@/database/models/user/userModel";

async function UpdateUserInfoNoPwd(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (typeof userId !== "string") {
    return res.status(500).send("Something went wrong with the user id.");
  }

  if (!req.body) {
    return res.status(500).send("No body was sent with the request.");
  }

  try {
    await connect();
    const confirmation = await UserModel.doUpdateUserInfoNoPwd(
      userId,
      req.body
    );

    if (confirmation.ok && confirmation.authCookie) {
      return res
        .status(confirmation.status)
        .setHeader("Set-Cookie", confirmation.authCookie)
        .json({ msg: confirmation.msg, token: confirmation.token });
    }

    return res.status(confirmation.status).json(confirmation.msg);
  } catch (err) {
    console.log(err);

    return res.status(500).send(`Error: ${err}`);
  }
}

export default UpdateUserInfoNoPwd;
