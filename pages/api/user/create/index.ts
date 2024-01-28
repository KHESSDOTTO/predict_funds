import type { NextApiRequest, NextApiResponse } from "next";
import { doCreateUser } from "@/database/functions/userFunctions";
import { connect, disconnect } from "@/database/database.config";

async function CreateUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await connect();
      const newUser = await doCreateUser(req.body);
      await disconnect();
      if (newUser) {
        return res.status(newUser.status).json(newUser.msg);
      }
      return res.status(500).json("newUser returned null/falsy.");
    } catch (err) {
      await disconnect();
      return res.status(500).json(err);
    }
  }
  disconnect();
  return res.status(400).send("Only POST method accepted at this endpoint.");
}

export default CreateUser;
