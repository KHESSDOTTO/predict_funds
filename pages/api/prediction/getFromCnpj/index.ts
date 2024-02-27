import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import { getPredictionsByCnpj } from "@/database/functions/predictionFunctions";

async function GetAllPredictionsByCnpj(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (!req.query || (req.query && !req.query.cnpj)) {
      return res
        .status(400)
        .send("No CNPJ was sent in the body of the request.");
    }
    if (typeof req.query.cnpj !== "string") {
      return res
        .status(400)
        .send("CNPJ sent in the body of the request is not in string format.");
    }
    try {
      await connect();
      const predictions4Weeks = await getPredictionsByCnpj(req.query.cnpj);
      // await disconnect();
      if (!predictions4Weeks) {
        return res.status(204).send("No predictions were found for this CNPJ.");
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
  return res.status(400).send("Only GET method accepted at this endpoint.");
}

export default GetAllPredictionsByCnpj;
