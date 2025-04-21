import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import PredictionsModel from "@/database/models/prediction/predictionsModel";

async function GetPredictionsWithBaseDate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).send("Only POST method accepted at this endpoint.");
  }

  try {
    await connect();
    const predictions = await PredictionsModel.getPredictions(req.body);

    if (!predictions) {
      return res
        .status(500)
        .send("No predictions were found for this CNPJ on this baseDate.");
    }

    return res.status(200).json(predictions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
}

export default GetPredictionsWithBaseDate;
