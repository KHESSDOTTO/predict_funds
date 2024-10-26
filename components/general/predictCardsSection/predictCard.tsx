import { HistoricType } from "@/utils/types";
import { useEffect, useState } from "react";

interface PredictCardProps {
  time: string;
  data: HistoricType[];
}

function PredictCard({ time, data }: PredictCardProps) {
  // console.log(props.data);
  // console.log(props.data[0].netFunding);
  const [total, setTotal] = useState(0);

  // Cálculo do total
  // useEffect(() => {
  //   const rawTotal = props.data.reduce((ac, cE) => {
  //     return ac + cE.netFunding;
  //   }, 0);
  //   const totalToUse = rawTotal.toFixed(2);
  //   setTotal(totalToUse);
  // }, [props]);

  // Formatação:
  let pClass = "text-indigo-900 underline text-xl",
    divClass1 =
      "rounded-md flex flex-col justify-center items-center border-2 border-gray-700 box-shadow bg-gradient-to-b to-white font-bold w-72 m-4 shadow-md shadow-black cursor-pointer text-gray-800 hover:text-indigo-900 transition-all hover:text-yellow-800 hover:bg-indigo-400/30 from-indigo-300/20";
  if (total < 0) {
    pClass = "text-red-800  underline text-xl";
    divClass1 =
      "rounded-md flex flex-col justify-center items-center border-2 border-gray-700 box-shadow bg-gradient-to-b to-white font-bold w-72 m-4 shadow-md shadow-black cursor-pointer text-gray-800 hover:text-indigo-900 transition-all hover:bg-indigo-300/40 from-red-900/30";
  }

  return (
    <div className={divClass1}>
      <div className=" border-b border-b-black w-full flex justify-center gap-2 items-center pt-4 pb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
          <path
            fillRule="evenodd"
            d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
            clipRule="evenodd"
          />
          <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
        </svg>
        <h2 className="text-lg">Total - {time}</h2>
      </div>
      <div className="flex justify-center items-center py-6">
        <p className={pClass}>Expected: R$ {total}</p>
      </div>
    </div>
  );
}

export default PredictCard;
