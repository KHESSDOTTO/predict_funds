import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import HistoricModel from "@/database/models/historicModel";

export default async function CheckOlderHistoric(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();

    // Find the most recent import date
    const lastImport = await HistoricModel.findOne(
      {},
      { _id: 0, datahora_proc_informes: 1 }
    )
      .sort({ datahora_proc_informes: -1 })
      .exec();

    const allImportDates = await HistoricModel.distinct(
      "datahora_proc_informes"
    ).exec();

    if (!lastImport) {
      return res.status(404).json({ msg: "No records found." });
    }

    const lastImportDate = lastImport._doc.datahora_proc_informes;

    // Count documents that would be deleted
    const olderDocumentsCount = await HistoricModel.countDocuments({
      datahora_proc_informes: {
        $lt: lastImportDate,
      },
    }).exec();

    // Count total documents in the collection
    const totalDocumentsCountBefore =
      await HistoricModel.countDocuments().exec();

    await HistoricModel.deleteMany({
      datahora_proc_informes: { $lt: lastImportDate },
    }).exec();

    const totalDocumentsCountAfter =
      await HistoricModel.countDocuments().exec();

    res.status(200).json({
      msg: "Result below.",
      allImportDates,
      lastImportDate,
      olderDocumentsCount,
      totalDocumentsCountBefore,
      totalDocumentsCountAfter,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred.", error: err });
  }
}
