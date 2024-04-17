import ButtonIndigo from "@/components/UI/buttonIndigo";
import { PredictionsType, RawDataType } from "@/utils/types";
import { addWeeks, subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface PredListPropsType {
  title: string;
  onlyBack: boolean;
  data: RawDataType[];
  predictions: PredictionsType[];
  varName: "VL_QUOTA" | "CAPTC_LIQ";
}

export default function PredList({
  title,
  onlyBack,
  data,
  predictions,
  varName,
}: PredListPropsType) {
  const [predRows, setPredRows] = useState([
    { id: uuidv4(), direction: "backward", numPer: 8 },
    { id: uuidv4(), direction: "backward", numPer: 4 },
  ]);
  const [lastHistoricDate, setLastHistoricDate] = useState(new Date());

  useEffect(() => {
    if (data[data.length - 1]) {
      setLastHistoricDate(data[data.length - 1].DT_COMPTC);
    }
  }, [data, predictions]);

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [newRow, setNewRow] = useState({
    id: uuidv4(),
    direction: "backward",
    numPer: 8,
  });
  const [showAddRow, setShowAddRow] = useState(false);

  function formatValue(
    direction: string,
    varName: string,
    currEntryBack: Record<string, any> | undefined,
    currEntryFront: Record<string, any> | undefined,
    formatter: Intl.NumberFormat
  ): string {
    // console.log("currEntryBack");
    // console.log(currEntryBack);
    // console.log("currEntryFront");
    // console.log(currEntryFront);
    if (direction === "backward" && currEntryBack) {
      const value = currEntryBack[varName];
      if (typeof value === "number") {
        return formatter.format(value);
      }
    } else if (
      direction === "forward" &&
      currEntryFront &&
      varName !== "VL_QUOTA"
    ) {
      const value = currEntryFront[varName];
      if (typeof value === "number") {
        return formatter.format(value);
      }
    }

    return "-";
  }

  function handleShowAddRow() {
    setShowAddRow(true);
    console.log("Clicked");
  }

  function handleChangeNewRow(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });
  }

  function handleAddRow() {
    const newPredRows = [...predRows];
    newPredRows.push(newRow);
    setPredRows(newPredRows);
    setShowAddRow(false);
    setNewRow({
      id: uuidv4(),
      direction: "backward",
      numPer: 8,
    });
  }

  function handleDeleteRow(e: React.MouseEvent<HTMLButtonElement>) {
    const updatedRows = predRows.filter((cE) => {
      return cE.id.toString() != e.currentTarget.id.toString();
    });
    setPredRows(updatedRows);
  }

  return (
    <div className="text-black h-full w-full pb-16 bg-gradient-to-br from-white from-15% to-white/30 border-black relative rounded-xl shadow-md shadow-indigo-900">
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
            let tgtDate = lastHistoricDate;
            // console.log("tgtDate");
            // console.log(tgtDate);
            let entriesBack = data;
            // console.log("entriesBack");
            // console.log(entriesBack);
            let entriesFront = predictions;
            // console.log("entriesFront");
            // console.log(entriesFront);

            if (cE.direction === "backward") {
              tgtDate = subWeeks(lastHistoricDate, cE.numPer);
              // console.log("newTgtDate");
              // console.log(tgtDate);
              entriesBack = entriesBack.filter((cE, cI) => {
                return cE.DT_COMPTC.getTime() == tgtDate.getTime();
              });
              // console.log("entryBackFilter");
              // console.log(entriesBack);
            }

            if (cE.direction === "forward") {
              tgtDate = addWeeks(lastHistoricDate, cE.numPer);
              // console.log("newTgtDate");
              // console.log(tgtDate);
              entriesFront = entriesFront.filter((cE) => {
                return (
                  cE.DT_COMPTC &&
                  cE.DT_COMPTC.getTime() == tgtDate.getTime() &&
                  cE.CAPTC_LIQ
                );
              });
              // console.log("entryFrontFilter");
              // console.log(entriesFront);
            }

            const currEntryBack = entriesBack[0];
            const currEntryFront = entriesFront[0];

            return (
              <tr
                className="text-center border-b border-black/20"
                key={cE.id.toString()}
              >
                <td className="p-0">{cE.direction}</td>
                <td className="p-0">{cE.numPer}</td>
                <td className="p-0">
                  {/* {data[data.length - 7 * cE.numPer] &&
                  cE.direction === "backward"
                    ? data[data.length - 7 * cE.numPer][varName] != undefined
                      ? formatter.format(
                          data[data.length - 7 * cE.numPer][varName]
                        )
                      : "-"
                    : "-"} */}
                  {formatValue(
                    cE.direction,
                    varName,
                    currEntryBack,
                    currEntryFront,
                    formatter
                  )}
                </td>
                <td className="text-red-800 p-1 text-base align-middle p-0">
                  <button
                    className="hover:text-red-600"
                    id={cE.id.toString()}
                    onClick={handleDeleteRow}
                  >
                    x
                  </button>
                </td>
              </tr>
            );
          })}
          {showAddRow && (
            <tr>
              <td className="text-center">
                <select
                  className="text-center bg-white/60 shadow-sm shadow-gray-500 border-gray-500 w-fit rounded-md my-1"
                  name="direction"
                  value={newRow.direction}
                  onChange={handleChangeNewRow}
                >
                  <option value="backward">Backward</option>
                  {!onlyBack && <option value="forward">Forward</option>}
                </select>
              </td>
              <td className="text-center">
                <input
                  className="text-center bg-white/60 shadow-sm shadow-gray-500 border-gray-500 w-1/2 rounded-md my-1"
                  type="text"
                  name="numPer"
                  value={newRow.numPer}
                  onChange={handleChangeNewRow}
                />
              </td>
              <td className="text-center">-</td>
              <td className="text-center"></td>
            </tr>
          )}
        </tbody>
      </table>
      <div
        className="flex justify-center items-center mt-2"
        onClick={handleShowAddRow}
      >
        <button className="text-indigo-800 text-xs font-semibold hover:underline hover:text-indigo-600">
          + Add Row
        </button>
      </div>
      <div className="absolute bottom-2 w-full ml-[-8px] text-center">
        <div className="flex justify-center">
          <div onClick={handleAddRow} className="w-fit">
            <ButtonIndigo shadowSize="md" shadowColor="black">
              Save
            </ButtonIndigo>
          </div>
        </div>
      </div>
    </div>
  );
}
