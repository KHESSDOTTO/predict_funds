import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function DisconnectFromMongoDB(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await mongoose.disconnect();
    res
      .status(200)
      .json({ status: 200, message: "Successfully disconnected." });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "Something went wrong when calling mongoose.disconnect().",
    });
  }
}
