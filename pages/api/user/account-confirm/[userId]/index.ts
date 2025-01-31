import type { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@/database/models/user/userModel";
import { connect } from "@/database/database.config";
import { track } from "@vercel/analytics/server";

async function EmailAccountConfirm(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (typeof userId !== "string") {
    return res.status(500).send("Something went wrong with the user id.");
  }

  try {
    await connect();
    const confirmation = await UserModel.doConfirmEmail(userId);

    if (confirmation.ok) {
      track("confirmed_email", { userId: userId });
    } else {
      track("failed_confirm_email", { userId: userId });
    }

    return res.status(confirmation.status).send(confirmation.msg);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err}`);
  }
}

export default EmailAccountConfirm;
