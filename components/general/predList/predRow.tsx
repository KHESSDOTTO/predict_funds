import { addWeeks, subWeeks } from "date-fns";
import { formatterBrNumber } from "@/utils/numberFormatters";
import { formatValuePredList, handleDeleteRow } from "./predListFunctions";
import { PredRowPropsType } from "./predListTypes";

export default function PredRow({
  cE,
  isPct,
  lastHistoricDate,
  historic,
  predictions,
  varName,
  predRows,
  setPredRows,
}: PredRowPropsType) {
  const direction = cE.direction;
  let tgtDate = lastHistoricDate;
  let entriesBack = historic;
  let entriesFront = predictions;

  if (direction === "backward") {
    tgtDate = subWeeks(lastHistoricDate, cE.numPer);
    entriesBack = entriesBack.filter((cE, cI) => {
      return cE.DT_COMPTC.getTime() == tgtDate.getTime();
    });
  }

  if (direction === "forward" && entriesFront) {
    tgtDate = addWeeks(lastHistoricDate, cE.numPer);
    entriesFront = entriesFront.filter((cE) => {
      return (
        cE.DT_COMPTC &&
        cE.DT_COMPTC.getTime() == tgtDate.getTime() &&
        cE[varName]
      );
    });
  }

  const currEntryBack = entriesBack[0];
  const currEntryFront = entriesFront ? entriesFront[0] : undefined;
  const formatValuePredListArgs = {
    isPct,
    direction,
    varName,
    currEntryBack,
    currEntryFront,
    formatter: formatterBrNumber,
  };

  return (
    <tr className="text-center border-b border-black/20" key={cE.id.toString()}>
      <td className="p-0">{direction}</td>
      <td className="p-0">{cE.numPer}</td>
      <td className="p-0">{formatValuePredList(formatValuePredListArgs)}</td>
      <td className="text-red-800 p-1 text-base align-middle">
        <button
          className="z-10 transition-all hover:text-red-600"
          data-id={cE.id.toString()}
          onClick={(e) => handleDeleteRow({ e, predRows, setPredRows })}
        >
          x
        </button>
      </td>
    </tr>
  );
}
