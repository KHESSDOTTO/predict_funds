import {
  HandleAddRowParamsType,
  FormatValuePredListParamsType,
  HandleDeleteRowParamsType,
} from "./predListTypes";
import { v4 as uuidv4 } from "uuid";

function formatValuePredList({
  isPct,
  direction,
  varName,
  currEntryBack,
  currEntryFront,
  formatter,
}: FormatValuePredListParamsType): string {
  let value = "";
  if (direction === "backward" && currEntryBack) {
    value = currEntryBack[varName];
  } else if (
    direction === "forward" &&
    currEntryFront &&
    varName !== "VL_QUOTA_ms"
  ) {
    value = currEntryFront[varName];
  }

  if (typeof value === "number" && !isPct) {
    return formatter.format(value);
  } else if (typeof value === "number" && isPct) {
    return formatter.format(value) + "%";
  }

  return "-";
}

function handleAddRow({
  predRows,
  newRow,
  setPredRows,
  setShowAddRow,
  setNewRow,
}: HandleAddRowParamsType): void {
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

function handleDeleteRow({
  e,
  predRows,
  setPredRows,
}: HandleDeleteRowParamsType) {
  const rowId = e.currentTarget.dataset.id;
  if (!rowId) {
    console.warn("No row ID found for deletion.");
    return;
  }
  console.log("Deleting row with id:", rowId);
  console.log("Current rows:", predRows);
  setPredRows((prevRows) => {
    const updatedRows = prevRows.filter((cE) => cE.id.toString() !== rowId);
    console.log("Updated rows:", updatedRows);
    return updatedRows;
  });
}

export { formatValuePredList, handleAddRow, handleDeleteRow };
