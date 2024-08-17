import { connect } from "@/database/database.config";
import CorrelationsModel from "@/database/models/correlationsModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function ChangeTickersCorrelsNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect(); // Ensure the database connection

    const mapTickers: { [key: string]: string } = {
      CLF: "Brent",
      EURBRLX: "Euro",
      GOLD11SA: "Gold",
      USDolar: "US_Dolar",
      BVSP: "IBOV",
      GSPC: "S&P_500",
      TNX: "US_Treasury_10y",
      DIxpre252dc30: "DI_-_30_days",
      DIxpre252dc360: "DI_-_360_days",
    };

    // Create an array of update operations
    const updateOps = Object.keys(mapTickers)
      .map((oldKey) => {
        const newKey = mapTickers[oldKey];

        // Skip empty newKey (if GSPC is meant to be removed, for example)
        if (newKey === "") return null;

        return {
          updateMany: {
            filter: { [oldKey]: { $exists: true } },
            update: {
              $rename: { [oldKey]: newKey },
            },
          },
        };
      })
      .filter(Boolean); // Remove null operations (e.g., when newKey is "")

    if (updateOps.length > 0) {
      await CorrelationsModel.bulkWrite(updateOps);
    }

    return res.status(200).json({ msg: "Success!" });
  } catch (err) {
    // Check if the error is an instance of Error to safely access the message
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).json({ err: err.message });
    } else {
      // Handle the case where the error is not an instance of Error
      console.error("An unknown error occurred");
      return res.status(500).json({ err: "An unknown error occurred" });
    }
  }
}
