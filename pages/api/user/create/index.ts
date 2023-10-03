import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/database/controllers/userController";
import { connect, disconnect } from "@/database/database";

async function CreateUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await connect();
      const newUser = await createUser(req.body);
      disconnect();
      if (newUser) {
        return res.status(200).json(newUser);
      } else {
        return res.status(500).send("Error creating user.");
      }
    } catch (err) {
      disconnect();
      return res.status(500).json(err);
    }
  }
  disconnect();
  return res.status(400).send("Only POST method accepted at this endpoint.");
}

export default CreateUser;
