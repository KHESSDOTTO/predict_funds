import HistoricModel from "../models/historicModel";

async function getAllHistoricByCnpj(cnpj: string, baseDate: string) {
  try {
    const lastUpdateDateDoc = await HistoricModel.findOne(
      {},
      {
        _id: 0,
        datahora_proc_informes: 1,
      }
    )
      .sort({ datahora_proc_informes: -1 })
      .exec();

    if (!lastUpdateDateDoc._doc) {
      console.log("Did not find the last update date for historic");
      return false;
    }

    const lastUpdateDate = lastUpdateDateDoc._doc.datahora_proc_informes;

    const allHistoric = await HistoricModel.find({
      CNPJ_FUNDO: cnpj,
      DT_COMPTC: { $lte: new Date(baseDate) },
      datahora_proc_informes: lastUpdateDate,
    });

    const finalResult = allHistoric.map((cE) => {
      const newDoc: any = { ...cE._doc };
      for (const key in cE._doc) {
        if (key === "CAPTC_LIQ_ms") {
          const newKey = "CAPTC_LIQ_ABS_ms";
          newDoc[newKey] = cE._doc[key];
        } else {
          newDoc[key] = cE._doc[key];
        }
      }

      const captcLiqPct =
        (cE._doc["CAPTC_LIQ_ms"] / cE._doc["VL_PATRIM_LIQ_ms"]) * 100;
      newDoc["CAPTC_LIQ_PCT_ms"] = captcLiqPct;

      cE._doc = newDoc;

      return cE;
    });

    return finalResult;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { getAllHistoricByCnpj };
