import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import PredictionsModel from "@/database/models/prediction/predictionsModel";

async function GetAncoras(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).send("Only GET method accepted at this endpoint.");
  }

  try {
    await connect();

    const ancoras = await PredictionsModel.getAncoras();

    return res.status(200).json(ancoras);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: err });
  }
}

export default GetAncoras;
