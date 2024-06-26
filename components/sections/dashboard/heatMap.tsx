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

  const cols: string[] = [];
  for (const key in correlAssocArr) {
    const colArr = key.split("_"),
      col1 = colArr[0],
      col2 = colArr[1];
    pushIfNew(col1, cols);
    pushIfNew(col2, cols);
  }
  const rows: string[] = cols;

  return (
    <>
      <h2 className={titleClass}>{title}</h2>
      <table className={tableClass}>
        <thead>
          <tr>
            <th></th>
            {cols.map((currCol) => {
              return (
                <th className="border border-white text-center p-2">
                  {currCol}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((currRow) => {
            return (
              <tr>
                <td className="border border-white text-center p-2">
                  {currRow}
                </td>
                {cols.map((currCol) => {
                  const name1 = currRow + "_" + currCol;
                  const name2 = currCol + "_" + currRow;
                  let key = name1;
                  if (name2 in correlAssocArr) {
                    key = name2;
                  }
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
    </>
  );
}
