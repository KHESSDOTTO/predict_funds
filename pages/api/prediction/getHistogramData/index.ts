import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import {
  getCnpjsByAnbimaClass,
  getPredictionsByCnpjList,
} from "@/database/functions/predictionFunctions";

async function GetHistogramData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).send("Only POST method accepted at this endpoint.");
  }

  if (!req.body.anbimaClass) {
    console.log("req.body");
    console.log(req.body);
    return res
      .status(500)
      .json({ status: "500", message: "There is no anbima class." });
  }

  try {
    await connect();
    const cnpjArr = await getCnpjsByAnbimaClass(req.body.anbimaClass);
    console.log("cnpjArr");
    console.log(cnpjArr);
    if (!cnpjArr) {
      return res.status(500).json({
        status: 500,
        message: "No cnpjs located by getCnpjsByAnbimaClass().",
      });
    }
    const predictions4Weeks = await getPredictionsByCnpjList(req.body, cnpjArr);
    // await disconnect();
    if (!predictions4Weeks) {
      return res
        .status(500)
        .send("There was an error when fetching the data for the histogram.");
    }
    console.log("predictions4Weeks:");
    console.log(predictions4Weeks);
    return res.status(200).json(predictions4Weeks);
  } catch (err) {
    console.error(err);
    // await disconnect();
    return res.status(500).json({ error: err });
  }
}

export default GetHistogramData;
