import type { NextApiRequest, NextApiResponse } from "next";
import { doConfirmEmail } from "@/database/functions/userFunctions";
import { connect } from "@/database/database.config";

async function EmailAccountConfirm(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (typeof userId !== "string") {
    return res.status(500).send("Something went wrong with the user id.");
  }
  try {
    await connect();
    const confirmation = await doConfirmEmail(userId);
    // await disconnect();
    return res.status(confirmation.status).send(confirmation.msg);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err}`);
  }
}

export default EmailAccountConfirm;
