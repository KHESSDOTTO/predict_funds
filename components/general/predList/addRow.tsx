import { AddRowPropsType } from "./predListTypes";

export default function AddRow({
  onlyBack,
  newRow,
  setNewRow,
}: AddRowPropsType) {
  return (
    <tr>
      <td className="text-center">
        <select
          className="cursor-pointer text-center bg-white/60 shadow-sm shadow-gray-500 border-gray-500 w-fit rounded-md my-1"
          name="direction"
          value={newRow.direction}
          onChange={(e) => {
            setNewRow({ ...newRow, [e.target.name]: e.target.value });
          }}
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
          onChange={(e) => {
            setNewRow({ ...newRow, [e.target.name]: e.target.value });
          }}
        />
      </td>
      <td className="text-center">-</td>
      <td className="text-center"></td>
    </tr>
  );
}
