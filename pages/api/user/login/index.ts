import type { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@/database/models/user/userModel";
import { connect } from "@/database/database.config";
import { track } from "@vercel/analytics/server";
import { UserModelDocType } from "@/database/models/user/userType";

async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).send("Only POST method accepted at this endpoint.");
  }

  try {
    await connect();
    const user = await UserModel.doLogin(req.body);

    if (user && user.ok && user.authCookie) {

      if (typeof user.msg === 'object') {
        const userContentMsg = user.msg as UserModelDocType;
        track("login", { username: userContentMsg.username });
      }

      return res
        .status(user.status)
        .setHeader("Set-Cookie", user.authCookie)
        .json({ ...(user.msg as object), token: user.token });
    } else {

      return res.status(user.status).json(user.msg);
    }
  } catch (err) {

    return res.status(500).json(err);
  }
}

export default Login;
