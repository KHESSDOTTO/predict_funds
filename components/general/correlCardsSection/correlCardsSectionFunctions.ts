import { consoleLog } from "@/utils/functions/genericFunctions";
import { ExportCorrelsParamsType } from "./correlCardsSectionTypes";
import * as XLSX from 'xlsx';

function exportCorrels({
  correls
}: ExportCorrelsParamsType): void {
  
  consoleLog({ correls });

  const workbook = XLSX.utils.book_new();
  const currTime = new Date();
  const fileName = "export_" + currTime.toISOString() + ".xlsx";

  // To do:
  // create two sheets, each one with title of janela_em_meses_<periodo>
  // and content of the corresponding correls.
  
  correls.forEach(currCorrelPeriod => {
    const periodElement = currCorrelPeriod.filter(currField => currField[0] === 'janela_em_meses');

    if (periodElement.length !== 1) {
      consoleLog({ periodElement });
      return;
    }

    const sheetTitle = periodElement.toString().replaceAll(",", "_");
    const sheetData = [[]];

    const sheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetTitle);
  })

  XLSX.writeFile(workbook, fileName);

  return;
}

export { exportCorrels };
