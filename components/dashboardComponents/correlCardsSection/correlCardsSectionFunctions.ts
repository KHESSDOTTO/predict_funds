import Helpers from "@/utils/functions/helpers/helpers";
import { ExportCorrelsParamsType } from "./correlCardsSectionTypes";
import * as XLSX from "xlsx";

function exportCorrels({ selCnpj, correls }: ExportCorrelsParamsType): void {
  const workbook = XLSX.utils.book_new();
  const currTime = new Date();
  const fileName = "export_correls_" + currTime.toISOString() + ".xlsx";

  correls.forEach((currCorrelPeriod) => {
    const periodElement = currCorrelPeriod.filter(
      (currField) => currField[0] === "janela_em_meses"
    );
    const sheetData = [
      ["selCnpj", selCnpj],
      ...currCorrelPeriod.filter(
        (currField) => currField[0] !== "janela_em_meses"
      ),
    ];

    if (periodElement.length !== 1) {
      Helpers.consoleLog({ periodElement });
      return;
    }

    const sheetTitle = periodElement.toString().replaceAll(",", "_");

    const sheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetTitle);
  });

  XLSX.writeFile(workbook, fileName);

  return;
}

export { exportCorrels };
