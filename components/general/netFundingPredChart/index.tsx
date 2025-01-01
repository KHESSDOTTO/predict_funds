import { useEffect, useState } from "react";
import { UnifiedDataPredsType } from "./netFundingPredChartTypes";
import { AbsOrPctNFFieldsType, AbsOrPctType } from "@/utils/types/generalTypes/types";
import { NFTooltip } from "./netFundingPredChartTooltip";
import { handleAbsOrPctChange } from "./forms/absOrPctPredsViewFormFunctions";
import { format } from "date-fns";
import {
  adjustNetFundingChartAxis,
  prepareChartNFData,
} from "./netFundingPredChartFunctions";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ResponsiveContainer,
  Line,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import PredList from "../predList";
import AbsOrPctPredsViewForm from "./forms/absOrPctPredsViewForm";
import type { NetFundingPredChartPropsType } from "./netFundingPredChartTypes";

export default function NetFundingPredChart({
  title = 'Net Funding',
  historic,
  predictions,
  smallV,
  isMobile,
  predList = true,
}: NetFundingPredChartPropsType) {
  const [domainYaxisNF, setDomainYaxisNF] = useState<number[]>([-100, 100]);
  const [ticksYaxisNF, setTicksYaxisNF] = useState<number[]>([]);
  const [unifiedNFData, setUnifiedNFData] = useState<UnifiedDataPredsType[]>([
    ...historic,
  ]);
  const [gradientOffset, setGradientOffset] = useState<number>(1);
  const [absOrPct, setAbsOrPct] =
    useState<AbsOrPctNFFieldsType>("CAPTC_LIQ_ABS_ms");
  const [absOrPctShort, setAbsOrPctShort] = useState<AbsOrPctType>("abs");
  const formArgs = {
    absOrPct,
    setAbsOrPct,
    setAbsOrPctShort,
    handleAbsOrPctChange,
  };

  useEffect(() => {
    if (historic.length === 0 || predictions.length === 0) {
      return;
    }

    const adjustNetFundingChartAxisArgs = {
      historic,
      absOrPct,
      predictions,
      setDomainYaxisNF,
      setTicksYaxisNF,
    };
    const axisAdjustmentSuccessfull = adjustNetFundingChartAxis(
      adjustNetFundingChartAxisArgs
    );

    if (axisAdjustmentSuccessfull) {
      const prepareChartNFDataArgs = {
        historic,
        predictions,
        setUnifiedNFData,
        setGradientOffset,
      };

      prepareChartNFData(prepareChartNFDataArgs);
    }
  }, [historic, predictions, absOrPct]);

  return (
    <div
      id="NetFundingDiv"
      className={` ${smallV ? "pt-4 lg:w-[45%]" : "w-full"}`}
    >
      <div className="flex justify-center lg:block">
        <h2
          className={`mb-4 ${
            smallV
              ? "text-md w-9/12 mx-auto text-black border-black"
              : "text-lg max-w-fit p-2 text-white/90 border-white/90"
          } font-semibold text-center border-b lg:pb-2 lg:max-w-full lg:px-4 lg:mx-0 lg:text-left`}
        >
          { title }
        </h2>
      </div>
      {!smallV && (
        <div className="text-sm text-gray-200 pb-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
          <AbsOrPctPredsViewForm {...formArgs} />
        </div>
      )}
      <div
        className={`flex flex-col gap-4 lg:flex-row ${
          smallV ? "" : "lg:mx-6 lg:mt-6"
        }`}
      >
        <div
          className={`bg-gray-800 px-1 pt-4 rounded-xl overflow-hidden ${
            (smallV ? "lg:w-full lg:h-[250px]" : "lg:h-[412px]") + (predList ? " lg:w-[60%]" : " w-full")
          }`}
        >
          <ResponsiveContainer
            height={smallV ? 240 : isMobile ? 300 : 400}
            minWidth={250}
          >
            <ComposedChart data={unifiedNFData}>
              <defs>
                <linearGradient id="customIndigo" x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset={gradientOffset}
                    stopColor="rgb(150, 130, 200)"
                    stopOpacity={0.85}
                  />
                  <stop
                    offset={gradientOffset}
                    stopColor="white"
                    stopOpacity={1}
                  />
                </linearGradient>
                <linearGradient
                  id="customIndigoDark"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset={gradientOffset}
                    stopColor="rgb(120, 50, 150)"
                    stopOpacity={1}
                  />
                  <stop
                    offset={gradientOffset}
                    stopColor="white"
                    stopOpacity={1}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="DT_COMPTC"
                tick={{ fill: "rgb(230, 230, 230)" }}
                height={30}
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                tickFormatter={(DT_COMPTC) => {
                  return format(DT_COMPTC, `dd/MM`);
                }}
              />
              <YAxis
                ticks={ticksYaxisNF}
                tick={{ fill: "rgb(230, 230, 230)" }}
                tickFormatter={(num) => {
                  const isPct = absOrPct === "CAPTC_LIQ_PCT_ms";
                  const numAbs = String((num / 1000).toFixed(0));
                  const numPct = num.toFixed(2);
                  return isPct ? `${numPct}%` : `R$${numAbs} k`;
                }}
                tickCount={11}
                domain={domainYaxisNF}
                width={65}
                fontSize={12}
              />
              <CartesianGrid stroke="rgb(170, 150, 255)" strokeWidth={0.3} />
              <Area
                dataKey={absOrPct}
                type="linear"
                fill="indigo"
                fillOpacity={0.15}
              />
              {[
                `CI95_${absOrPctShort.toUpperCase()}_limits`,
                `CI99_${absOrPctShort.toUpperCase()}_limits`,
              ].map((cE) => {
                return (
                  <Area
                    key={cE}
                    dataKey={cE}
                    type="linear"
                    fill="gray"
                    fillOpacity={0.2}
                    strokeWidth={0}
                  />
                );
              })}
              <Line
                type="linear"
                dataKey={absOrPct}
                stroke="url(#customIndigo)"
                strokeWidth={2}
                dot={{
                  stroke: "rgb(150, 130, 200)",
                  strokeWidth: 2,
                }}
              ></Line>

              <ReferenceLine y={0} fill="white" strokeWidth={2} />

              <Tooltip
                content={
                  <NFTooltip
                    data={unifiedNFData}
                    absOrPct={absOrPct}
                    numWeeksPreds={predictions.length}
                  />
                }
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {
          ! smallV && predList &&
            (
              <div className="lg:px-4 mt-1 lg:w-[40%] lg:mr-4">
                <PredList
                  title="Net Funding"
                  onlyBack={false}
                  historic={historic}
                  predictions={predictions}
                  varName={absOrPct}
                />
              </div>
            )
        }

      </div>
    </div>
  );
}
