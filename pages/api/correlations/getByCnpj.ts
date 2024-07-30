import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import { getLastCorrelationsByCnpj } from "@/database/functions/correlationsFunctions";

async function GetLastCorrelationsByCnpj(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).send("Only GET method accepted at this endpoint.");
  }

  try {
    await connect();
    const cnpj = req.query.cnpj;
    const cnpjCorrect = cnpj && typeof cnpj === "string";

    if (!cnpjCorrect) {
      return res.status(400).json({
        error:
          "Invalid CNPJ format. CNPJ should be present in the query and should be a string",
      });
    }

    const correls = await getLastCorrelationsByCnpj(cnpj);

    let adjustCorrels = correls;
    if (correls) {
      adjustCorrels = correls.map((cE) => Object.entries(cE._doc));
    }

    return res.status(200).json(adjustCorrels);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
}

export default GetLastCorrelationsByCnpj;
