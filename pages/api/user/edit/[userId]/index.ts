import type { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect } from "@/database/database.config";
import { doUpdateUserInfoNoPwd } from "@/database/functions/userFunctions";

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
    const confirmation = await doUpdateUserInfoNoPwd(userId, req.body);
    await disconnect();
    return res.status(confirmation.status).send(confirmation.msg);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err}`);
  }
}

export default UpdateUserInfoNoPwd;
