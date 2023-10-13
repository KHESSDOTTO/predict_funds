import type { NextApiRequest, NextApiResponse } from "next";
import { doLogin } from "@/database/controllers/userController";
import { connect, disconnect } from "@/database/database.config";

async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await connect();
      const user = await doLogin(req.body);
      await disconnect();
      if (user) {
        if (user.ok && user.authCookie) {
          return res
            .status(user.status)
            .setHeader("Set-Cookie", user.authCookie)
            .json({ ...user.msg, token: user.token });
        } else {
          return res.status(user.status).json(user.msg);
        }
      }
      return res.status(500).json("user returned null/falsy.");
    } catch (err) {
      await disconnect();
      return res.status(500).json(err);
    }
  }
  disconnect();
  return res.status(400).send("Only POST method accepted at this endpoint.");
}

export default Login;
