import type { NextApiRequest, NextApiResponse } from "next";
import { connect, disconnect } from "@/database/database.config";
import { doUpdateUserPwd } from "@/database/functions/userFunctions";

async function UpdateUserPwd(req: NextApiRequest, res: NextApiResponse) {
  const { userId, changeId } = req.query;
  if (req.method !== "POST") {
    return res.status(500).send("Only post method accepted on this endpoint.");
  }
  if (typeof userId !== "string") {
    return res.status(500).send("Something went wrong with the user id.");
  }
  if (typeof changeId !== "string") {
    return res.status(500).send("Wrong format of changeId.");
  }
  if (!req.body) {
    return res.status(500).send("No body was sent with the request.");
  }
  try {
    await connect();
    const confirmation = await doUpdateUserPwd(userId, changeId, req.body);
    await disconnect();
    return res.status(confirmation.status).send(confirmation.msg);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err}`);
  }
}

export default UpdateUserPwd;
