import { HeatMapObjType } from "./heatMapTypes";
import type { ExportHeatMapParams, PrepareHeatMapParamsType } from "./heatMapTypes";
import * as XLSX from 'xlsx';

function prepareHeatMap({
  heatMapObj,
  exclude,
  numMonths,
  setTickers,
  setSelCorrels,
}: PrepareHeatMapParamsType): void {
  const keys = Object.keys(heatMapObj) as (keyof HeatMapObjType)[];
  let newSelCorrel: HeatMapObjType = {
    avg: {},
    fund: {},
  };

  for (const key of keys) {
    const correlArrays = heatMapObj[key as keyof HeatMapObjType];
    const newSelCorrelEl = correlArrays.filter((cE: any) => {
      return cE["janela_em_meses"] === numMonths;
    });

    if (newSelCorrelEl.length === 1) {
      newSelCorrel[key as keyof HeatMapObjType] = newSelCorrelEl[0];
    }
  }

  if (newSelCorrel.fund && newSelCorrel.avg) {
    const newTickers: string[] = Object.keys(newSelCorrel.fund);
    const filteredTickers = newTickers.filter((cE) => !exclude.includes(cE));

    setTickers(filteredTickers);
    setSelCorrels(newSelCorrel);
  }
}

function exportHeatMap({
    heatMapObj
}: ExportHeatMapParams): void {
  const workbook = XLSX.utils.book_new();
  const currTime = new Date();
  const fileName = "export_heatmap_" + currTime.toISOString() + ".xlsx";
  const sheetTitles = Object.keys(heatMapObj) as (keyof HeatMapObjType)[];

  sheetTitles.forEach(currTitle => {
    const sheetContent = Object.entries(heatMapObj[currTitle])
    const currSheet = XLSX.utils.aoa_to_sheet(sheetContent);

    XLSX.utils.book_append_sheet(workbook, currSheet, currTitle);
  })

  XLSX.writeFile(workbook, fileName);

  return;
}

export {
  prepareHeatMap,
  exportHeatMap,
};
