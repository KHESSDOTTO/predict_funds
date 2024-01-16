import ButtonIndigo from "@/components/UI/buttonIndigo";
import { RawDataType } from "@/utils/types";
import { useState } from "react";

interface PredListPropsType {
  title: string;
  onlyBack: boolean;
  data: RawDataType[];
  varName: string;
}

export default function PredList({
  title,
  onlyBack,
  data,
  varName,
}: PredListPropsType) {
  const [predRows, setPredRows] = useState([
    { id: 1, direction: "backward", numPer: 8 },
    { id: 2, direction: "backward", numPer: 4 },
  ]);

  const [newRow, setNewRow] = useState({
    id: 10 * Math.random(),
    direction: "backward",
    numPer: 8,
  });
  const [showAddRow, setShowAddRow] = useState(false);

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
      id: 10 * Math.random(),
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
    <div className="h-full w-full pb-16 bg-white/90 p-2 border-b-2 border-black relative lg:rounded-md lg:border-2 lg:overflow-y-scroll">
      {title && (
        <h2 className="font-bold border-t border-b mb-1 text-center border-black text-base py-1">
          {title}
        </h2>
      )}
      <table className="w-full border-b border-gray-300">
        <thead className="border-b-2 border-black">
          <tr>
            <th>Back / Forward</th>
            <th>Number of weeks</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {predRows.map((cE) => {
            return (
              <tr className="text-center border-b border-gray-300">
                <td className="p-0">{cE.direction}</td>
                <td className="p-0">{cE.numPer}</td>
                <td className="p-0">Yet to finish - KD</td>
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
                  className="text-center bg-white border border-gray-500 w-fit rounded-md my-1"
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
                  className="text-center bg-white border border-gray-500 w-1/2 rounded-md my-1"
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
          + Add Prediction
        </button>
      </div>
      <div className="absolute bottom-2 w-full ml-[-8px] text-center">
        <div className="flex justify-center">
          <div onClick={handleAddRow} className="w-fit">
            <ButtonIndigo>Save</ButtonIndigo>
          </div>
        </div>
      </div>
    </div>
  );
}
