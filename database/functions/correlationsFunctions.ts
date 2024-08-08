import CorrelationsModel from "../models/correlationsModel";

async function getMostRecentCorrelsByCnpj(cnpj: string) {
  const mostRecentCorrelations = [];
  const correlPeriods = [6, 12];

  try {
    for (const correlPeriod of correlPeriods) {
      const lastCorrels = await CorrelationsModel.findOne(
        {
          CNPJ_FUNDO: cnpj,
          janela_em_meses: correlPeriod,
        },
        {
          _id: 0,
          CNPJ_FUNDO: 0,
          ancora: 0,
          data_calc_correlacao: 0,
        }
      )
        .sort({ data_calc_correlacao: -1 })
        .exec();

      mostRecentCorrelations.push(lastCorrels);
    }

    return mostRecentCorrelations;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getAvgMostRecentCorrelsByAnbimaClass(
  anbimaClass: string
): Promise<any[]> {
  try {
    const correlPeriods = [6, 12];
    const nonCalculatingFields = [
      "_id",
      "CNPJ_FUNDO",
      "ancora",
      "janela_em_meses",
      "data_calc_correlacao",
      "CLASSE_ANBIMA",
    ];

    const results: any[] = [];

    for (const correlPeriod of correlPeriods) {
      const lastCorrel = await CorrelationsModel.findOne(
        {
          CLASSE_ANBIMA: anbimaClass,
          janela_em_meses: correlPeriod,
        },
        {
          _id: 0,
          CNPJ_FUNDO: 0,
          ancora: 0,
        }
      )
        .sort({ data_calc_correlacao: -1 })
        .exec();

      if (!lastCorrel) continue; // Skip if no correlation found

      const lastBaseDate = lastCorrel.data_calc_correlacao;
      const correlFields = Object.keys(lastCorrel._doc).filter(
        (field) => !nonCalculatingFields.includes(field)
      );

      // Find all correlations with the same base date
      const correls = await CorrelationsModel.find(
        {
          CLASSE_ANBIMA: anbimaClass,
          janela_em_meses: correlPeriod,
          data_calc_correlacao: lastBaseDate,
        },
        {
          _id: 0,
          CNPJ_FUNDO: 0,
          ancora: 0,
          data_calc_correlacao: 0,
        }
      ).exec();

      console.log("correls");
      console.log(correls);

      const averages: { [field: string]: any } = {};

      // Calculate the averages for each field
      for (const field of correlFields) {
        const sum = correls.reduce((acc, doc) => acc + doc[field], 0);
        averages[field] = sum / correls.length;
      }

      // Push the result for this period into the results array
      results.push({
        ...averages,
        janela_em_meses: correlPeriod,
        CLASSE_ANBIMA: anbimaClass,
      });
    }

    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export { getMostRecentCorrelsByCnpj, getAvgMostRecentCorrelsByAnbimaClass };
