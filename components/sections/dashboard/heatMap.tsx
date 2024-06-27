import { pushIfNew } from "@/utils/functions";

export interface CorrelAssocArrType {
  [key: string]: number;
}

export interface HeatMapPropsType {
  title: string;
  correlAssocArr: CorrelAssocArrType;
}

export default function HeatMap({ title, correlAssocArr }: HeatMapPropsType) {
  const titleClass: string = "text-center border-b border-white mb-4",
    tableClass: string = "text-center border border-white";

  const colsDesk: string[] = [];
  const rowsDesk: string[] = [];
  for (const key in correlAssocArr) {
    const colArr = key.split("_"),
      col1 = colArr[0],
      col2 = colArr[1];
    pushIfNew(col1, colsDesk);
    pushIfNew(col2, rowsDesk);
  }
  const colsMobile: string[] = rowsDesk;
  const rowsMobile: string[] = colsDesk;

  return (
    <>
      {/* Desk */}
      <h2 className={titleClass}>{title}</h2>
      <table className={tableClass + " hidden lg:table"}>
        <thead>
          <tr className="hidden lg:table-row">
            <th></th>
            {colsDesk.map((currCol) => {
              return (
                <th className="border border-white text-center p-2">
                  {currCol}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="hidden lg:table-row-group">
          {rowsDesk.map((currRow) => {
            return (
              <tr>
                <td className="border border-white text-center p-2">
                  {currRow}
                </td>
                {colsDesk.map((currCol) => {
                  const key = currCol + "_" + currRow;
                  return (
                    <td className="border border-white text-center p-2">
                      {correlAssocArr[key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* End Desk */}
      {/* Mobile */}
      <table className={tableClass + " hidden lg:table"}>
        <thead>
          <tr>
            <th></th>
            {colsMobile.map((currCol) => {
              return (
                <th className="border border-white text-center p-2">
                  {currCol}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rowsMobile.map((currRow) => {
            return (
              <tr>
                <td className="border border-white text-center p-2">
                  {currRow}
                </td>
                {colsMobile.map((currCol) => {
                  const key = currRow + "_" + currCol;
                  return (
                    <td className="border border-white text-center p-2">
                      {correlAssocArr[key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* End Mobile */}
    </>
  );
}
