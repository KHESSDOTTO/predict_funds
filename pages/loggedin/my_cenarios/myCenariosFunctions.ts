import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import type { HistoricType } from "@/utils/types";
import type {
  UpdateFooterPositionParamsType,
  ExcludeCenarioParamsType,
  ExportCenariosParamsType,
} from "./myCenariosTypes";

function updateFooterPosition({
  footerRef,
  setFooterPosition,
}: UpdateFooterPositionParamsType) {
  if (footerRef.current) {
    const footerHeight = footerRef.current.clientHeight;
    const atBottom =
      window.scrollY + window.innerHeight - 20 >=
      document.documentElement.scrollHeight;
    const contentTooShort =
      window.innerHeight >= document.body.offsetHeight - footerHeight;

    if (atBottom) {
      setFooterPosition("absolute");
    } else if (contentTooShort) {
      setFooterPosition("absolute");
    } else {
      setFooterPosition("sticky");
    }
  }
}

function excludeCenario({
  cenarioId,
  cenarios,
  setCenarios,
}: ExcludeCenarioParamsType) {
  const updatedCenarios = cenarios.filter((cE) => {
    return cE.id != cenarioId;
  });
  setCenarios(updatedCenarios);
  toast.success("Removed cenario.");
}

function exportCenarios({ cenarios }: ExportCenariosParamsType) {
  if (cenarios.length === 0) {
    toast.error("No cenarios were saved to export.");
    return;
  }
  const workbook = XLSX.utils.book_new();
  cenarios.forEach((cenario, i) => {
    const ws_name = "Cenario " + (i + 1);
    const colsToHide = ["TP_FUNDO", "_id"];
    const paramsArray = Object.entries(cenario.params).map(([cK, cV]) => [
      cK,
      cV,
    ]);

    // <Adjusting_predictions>
    const predsArray: any = [];
    cenario.predictionData
      .slice(cenario.predictionData.length - 1)
      .forEach((cE) => {
        const predsSubArray = Object.entries(cE).map(([cK, cV]) => {
          if (Array.isArray(cV)) {
            return [cK, ...cV];
          }
          return [cK, cV];
        });
        predsArray.push(...predsSubArray);
      });
    // </Adjusting_predictions>
    const historicDataHeader: (keyof HistoricType)[] = [
      "DT_COMPTC",
      "CNPJ_FUNDO",
      "VL_TOTAL_ms",
      "VL_PATRIM_LIQ_ms",
      "NR_COTST_ms",
      "VL_QUOTA_ms",
      "CAPTC_DIA_ms",
      "RESG_DIA_ms",
      "CAPTC_LIQ_ms",
    ];
    const historicDataArray = cenario.historicData.map((dataRow) => {
      const orderedDataRow = historicDataHeader.map((key) => {
        return [key, dataRow[key]];
      });
      const result = orderedDataRow.map(([cK, cV]) => {
        if (typeof cK == "string" && !colsToHide.includes(cK)) {
          return cV;
        }
        return false;
      });

      return result.filter((cE) => cE !== false);
    });
    const data = [
      ["Params"],
      ...paramsArray,
      [],
      ["Prediction"],
      ...predsArray,
      [],
      ["Historic"],
      historicDataHeader,
      ...historicDataArray,
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, ws_name);
  });
  XLSX.writeFile(workbook, "export-cenarios.xlsx");
}

export { updateFooterPosition, excludeCenario, exportCenarios };
