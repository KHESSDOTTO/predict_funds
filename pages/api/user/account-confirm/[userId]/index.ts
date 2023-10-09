import type { NextApiRequest, NextApiResponse } from "next";
import { doConfirmEmail } from "@/database/controllers/userController";
import { connect, disconnect } from "@/database/database";

async function EmailAccountConfirm(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (req.method !== "PUT") {
    return res.status(400).send("Only PUT method accepted at this endpoint.");
  }
  if (typeof userId !== "string") {
    return res.status(500).send("Something went wrong with the id.");
  }
  try {
    await connect();
    const confirmation = await doConfirmEmail(userId);
    await disconnect();
    return res.status(confirmation.status).send(confirmation.msg);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err}`);
  }
}

export default EmailAccountConfirm;
