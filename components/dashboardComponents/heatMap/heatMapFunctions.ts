import { consoleLog } from "@/utils/functions/genericFunctions";
import { HeatMapObjType } from "./heatMapTypes";
import type {
  ExportHeatMapParams,
  PrepareHeatMapParamsType,
  ReshapedHeatMapObjType,
} from "./heatMapTypes";
import * as XLSX from "xlsx";
import { mapTickers } from "@/utils/mapTickersCorrels";

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

function exportHeatMap({ selCnpj, heatMapObj }: ExportHeatMapParams): void {
  const workbook = XLSX.utils.book_new();
  const currTime = new Date();
  const fileName = "export_heatmap_" + currTime.toISOString() + ".xlsx";
  const heatMapKeys = Object.keys(heatMapObj) as (keyof HeatMapObjType)[];
  const reshapedHeatMapObj: ReshapedHeatMapObjType = {};

  heatMapKeys.forEach((currKey) => {
    heatMapObj[currKey].forEach((currobj: any) => {
      const periodString = "janela_em_meses_" + currobj["janela_em_meses"];
      const copy = { ...currobj };
      delete copy["janela_em_meses"];

      const content = Object.entries(copy);

      if (!reshapedHeatMapObj[periodString]) {
        reshapedHeatMapObj[periodString] = {
          avg: [{}],
          fund: [{}],
        };
      }

      reshapedHeatMapObj[periodString][currKey] = content;
    });
  });

  const sheetTitles = Object.keys(
    reshapedHeatMapObj
  ) as (keyof ReshapedHeatMapObjType)[];

  sheetTitles.forEach((currTitle) => {
    const currData = reshapedHeatMapObj[currTitle];
    const sheetContent: (number | string)[][] = [];
    sheetContent.push(["sel_cnpj", selCnpj], ["", "fund", "avg"]);

    currData["fund"].forEach((cE: (string | number)[]) => {
      const fundFieldName = cE[0];
      const fundFieldValue = cE[1];
      const avgFieldElement = currData["avg"].find(
        (el: (string | number)[]) => el[0] === fundFieldName
      );

      if (!avgFieldElement || avgFieldElement.length < 2) {
        console.log(
          "Did not find corresponding avg correl on heat map on element: " +
            fundFieldName
        );
        return;
      }

      sheetContent.push([
        mapTickers[fundFieldName] ? mapTickers[fundFieldName] : fundFieldName,
        fundFieldValue,
        avgFieldElement[1],
      ]);
    });

    const currSheet = XLSX.utils.aoa_to_sheet(sheetContent);

    XLSX.utils.book_append_sheet(workbook, currSheet, String(currTitle));
  });

  XLSX.writeFile(workbook, fileName);

  return;
}

export { prepareHeatMap, exportHeatMap };
