import ButtonIndigo from "@/components/UI/buttonIndigo";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { handleAddRow } from "./predListFunctions";
import PredRow from "./predRow";
import AddRow from "./addRow";
import type {
  PredListPropsType,
  PredRowStaticParamsType,
  PredRowType,
} from "./predListTypes";

export default function PredList({
  title,
  onlyBack,
  historic,
  predictions,
  varName,
}: PredListPropsType) {
  const [showAddRow, setShowAddRow] = useState(false);
  const [lastHistoricDate, setLastHistoricDate] = useState(new Date());
  const isPct = varName === "CAPTC_LIQ_PCT_ms";
  const [predRows, setPredRows] = useState<PredRowType[]>([
    { id: uuidv4(), direction: "backward", numPer: 8 },
    { id: uuidv4(), direction: "backward", numPer: 4 },
  ]);
  const [newRow, setNewRow] = useState<PredRowType>({
    id: uuidv4(),
    direction: "backward",
    numPer: 8,
  });
  const handleAddRowArgs = {
    predRows,
    newRow,
    setPredRows,
    setShowAddRow,
    setNewRow,
  };
  let predRowStaticArgs: PredRowStaticParamsType = {
    isPct,
    lastHistoricDate,
    historic,
    predictions,
    varName,
    predRows,
    setPredRows,
  };
  const addRowArgs = {
    newRow,
    setNewRow,
    onlyBack,
  };

  useEffect(() => {
    if (historic[historic.length - 1]) {
      setLastHistoricDate(historic[historic.length - 1].DT_COMPTC);
    }
  }, [historic, predictions]);

  return (
    <div className="text-black h-full w-full pb-20 pt-2 bg-gradient-to-br from-white from-15% to-white/30 border-black relative rounded-xl shadow-md shadow-indigo-900">
      {title && (
        <div className="flex justify-center w-full">
          <h2 className="font-bold mb-4 text-center border-black text-base py-1 px-4 border-b">
            {title}
          </h2>
        </div>
      )}
      <table className="w-full border-gray-300">
        <thead className="border-b-2 border-black">
          <tr>
            <th>Back / Forward</th>
            <th>Number of weeks</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {predRows.map((cE) => {
            const predRowArgs = { ...predRowStaticArgs, cE };
            return <PredRow {...predRowArgs} />;
          })}
          {showAddRow && <AddRow {...addRowArgs} />}
        </tbody>
      </table>
      <div
        className="flex justify-center items-center mt-2"
        onClick={() => {
          setShowAddRow(true);
        }}
      >
        <button className="text-indigo-800 text-xs font-semibold transition-all duration-200 hover:text-indigo-600">
          + Add Row
        </button>
      </div>
      <div className="absolute bottom-4 w-full text-center">
        <div className="flex justify-center">
          <div onClick={() => handleAddRow(handleAddRowArgs)} className="w-fit">
            <ButtonIndigo shadowSize="md" shadowColor="black">
              Save
            </ButtonIndigo>
          </div>
        </div>
      </div>
    </div>
  );
}
