import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import CorrelationsModel from "@/database/models/correlation/correlationsModel";

async function GetMostRecentCorrelsByClassificacao(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).send("Only GET method accepted at this endpoint.");
  }

  try {
    await connect();
    const classificacao = req.query.classificacao;
    const classificacaoCorrect =
      classificacao && typeof classificacao === "string";

    if (!classificacaoCorrect) {
      return res.status(400).json({
        error:
          "Invalid 'classificacao' format. 'Classificacao' should be present in the query and should be a string",
      });
    }

    const mostRecentCorrels =
      await CorrelationsModel.getAvgCorrelsByClassificacao(classificacao);

    return res.status(200).json(mostRecentCorrels);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: err });
  }
}

export default GetMostRecentCorrelsByClassificacao;
