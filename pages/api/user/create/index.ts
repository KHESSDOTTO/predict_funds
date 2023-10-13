import type { NextApiRequest, NextApiResponse } from "next";
import { doCreateUser } from "@/database/controllers/userController";
import { connect, disconnect } from "@/database/database.config";
import transporter from "@/utils/transporter.config";

async function sendConfirmEmail(userId: string, email: string) {
  transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Confirm Your E-mail - PREDICT FUNDS",
    html: `<p>Click here to activate your account:<p> <a href=https://predict-funds.vercel.app/api/user/account-confirm/${userId}>CLICK HERE</a>`,
  });
}

async function CreateUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await connect();
      const newUser = await doCreateUser(req.body);
      await disconnect();
      if (newUser) {
        if (newUser.ok) {
          sendConfirmEmail(newUser.msg._id, newUser.msg.email);
          return res.status(newUser.status).json(newUser.msg);
        } else {
          return res.status(newUser.status).json(newUser.msg);
        }
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
