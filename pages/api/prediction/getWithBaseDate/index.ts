import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import { getPredictions } from "@/database/functions/predictionFunctions";

async function GetPredictionsWithBaseDate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).send("Only POST method accepted at this endpoint.");
  }

  try {
    await connect();
    const predictions4Weeks = await getPredictions(req.body);
    // await disconnect();
    if (!predictions4Weeks) {
      return res
        .status(500)
        .send("No predictions were found for this CNPJ on this baseDate.");
    }
    // console.log("predictions4Weeks:");
    // console.log(predictions4Weeks);
    return res.status(200).json(predictions4Weeks);
  } catch (err) {
    console.error(err);
    // await disconnect();
    return res.status(500).json({ error: err });
  }
}

export default GetPredictionsWithBaseDate;
