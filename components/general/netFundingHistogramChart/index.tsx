import { NetFundingHistogramChartPropsType } from "./netFundingHistogramChartTypes";
import { ClipLoader } from "react-spinners";
import AbsOrPctHistogramViewForm from "./forms/absOrPctHistogramViewForm";
import HistogramTooltip from "./netFundingHistogramChartTooltip";
import HistogramTooltipCursor from "./netFundingHistogramChartCursorTooltip";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { AbsOrPctType, FinalHistogramData } from "@/utils/types";
import { useState } from "react";

export default function NetFundingHistogramChart({
  smallV,
  anbimaClass,
  isMobile,
  loadingHistogram,
  histogram = false,
}: NetFundingHistogramChartPropsType) {
  const [absOrPct, setAbsOrPct] = useState<AbsOrPctType>("abs");

  return (
    <div
      id="HistogramDiv"
      className={` ${smallV ? "px-2 lg:w-[48.5%] hidden" : "py-8 w-full"}`}
    >
      <div className="flex justify-center lg:block">
        <h2
          className={`mb-4 p-2 max-w-[75%] ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg mx-[16vw] text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:px-2 lg:mx-4 lg:text-left lg:max-w-full lg:w-full`}
        >
          Preds. Histogram (Market - same ANBIMA Class)
        </h2>
      </div>
      {anbimaClass && (
        <div className="relative top-1 flex justify-center lg:block lg:mb-2 lg:top-0">
          <ul className="list-inside lg:list-disc">
            <li className="text-sm lg:ml-12">
              <span className="mr-2 font-semibold italic lg:not-italic lg:text-base">
                Anbima class:
              </span>
              <span className="text-white/80 italic">{anbimaClass}</span>
            </li>
          </ul>
        </div>
      )}
      <div className="text-sm text-gray-200 py-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
        <AbsOrPctHistogramViewForm {...{ absOrPct, setAbsOrPct }} />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          className={`bg-gray-900 pt-4 mx-2 rounded-sm ${
            smallV ? "lg:w-full lg:h-[210px]" : "lg:w-[95%]"
          } lg:rounded-xl lg:mx-8`}
          style={{ height: isMobile ? 300 : 500 }}
        >
          {loadingHistogram && (
            <div className="flex flex-col h-full relative items-center justify-center">
              <div>
                <ClipLoader
                  color={"white"}
                  loading={loadingHistogram}
                  size={50}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  className="my-4"
                  speedMultiplier={0.75}
                />
              </div>
            </div>
          )}
          {!loadingHistogram && (
            <ResponsiveContainer
              height={smallV ? 200 : isMobile ? 300 : 500}
              minWidth={250}
            >
              <BarChart
                width={900}
                height={isMobile ? 300 : 500}
                data={
                  histogram
                    ? histogram[absOrPct as keyof FinalHistogramData]
                    : []
                }
              >
                <CartesianGrid strokeLinecap="round" strokeWidth={0.5} />
                <XAxis
                  dataKey="xTick"
                  fontSize={isMobile ? 10 : 11}
                  className="text-white"
                  interval={isMobile ? 1 : 0}
                />
                <YAxis />
                <Tooltip
                  content={<HistogramTooltip />}
                  cursor={<HistogramTooltipCursor />}
                />
                <Bar dataKey="value" color="black">
                  {histogram &&
                    histogram[absOrPct]?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.selCnpjBin ? "#82ca9d" : "#8884d8"}
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
