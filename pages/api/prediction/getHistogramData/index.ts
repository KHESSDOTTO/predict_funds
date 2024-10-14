import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import PredictionsModel from "@/database/models/prediction/predictionsModel";

async function GetHistogramData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).send("Only POST method accepted at this endpoint.");
  }

  if (!req.body.anbimaClass) {
    return res
      .status(500)
      .json({ status: "500", message: "There is no anbima class." });
  }

  try {
    await connect();
    const predictions4Weeks = await PredictionsModel.getPredsForHistogram(
      req.body
    );

    if (!predictions4Weeks) {
      return res
        .status(500)
        .send("There was an error when fetching the data for the histogram.");
    }

    return res.status(200).json(predictions4Weeks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
}

export default GetHistogramData;
