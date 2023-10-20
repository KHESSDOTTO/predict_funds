import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

function Logout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.log("Only POST method accepted at this endpoint.");
    return res.status(500).send("Only POST method accepted at this endpoint.");
  }
  if (!req.cookies.loggedInUser) {
    console.log("Didn't find the cookie loggedInUser.");
    return res.status(500).send("Didn't find the cookie loggedInUser.");
  }
  const expiredCookie = serialize("loggedInUser", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  console.log("End of code.");
  return res
    .status(200)
    .setHeader("Set-Cookie", expiredCookie)
    .send("Successfully logged out.");
}

export default Logout;
